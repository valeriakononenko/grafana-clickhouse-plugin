package main

import (
  "errors"
  "fmt"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "reflect"
  "time"
)

var SplitLabelFieldName = "label"
var SplitTimeFieldName = "time"
var SplitValueFieldName = "value"
var SplitTimeFieldType = "DateTime"

func getLabel(row map[string]interface{}) (string, error)  {
  labelValue, okValue := row[SplitLabelFieldName]
  if okValue {
	label, ok := labelValue.(string)
	if ok {
	  return label, nil
	}
  }

  return "", errors.New("unable to parse label field")
}

func getTime(row map[string]interface{}) (string, error)  {
  timeValue, okValue := row[SplitTimeFieldName]
  if okValue {
	switch t := timeValue.(type) {
	case time.Time:
	  return t.Format(dateTimeLayout), nil
	case string:
	  return t, nil
	default:
	  backend.Logger.Warn(
	    fmt.Sprintf("Unable to parse time [%v] of type %v", timeValue, reflect.TypeOf(timeValue)))
	}
  }

  return "", errors.New("unable to parse time field")
}

func shouldSplit(fieldsMeta []*FieldMeta) bool {
  fieldsSum := 0
  checkSum := 111

  for _, meta := range fieldsMeta {
    if meta.Name == SplitLabelFieldName {
      fieldsSum += 100
	} else if meta.Name == SplitTimeFieldName {
	  fieldsSum += 10
	} else if meta.Name == SplitValueFieldName {
	  fieldsSum += 1
	}
  }

  return fieldsSum == checkSum
}

func getValueMeta(fieldsMeta []*FieldMeta) *FieldMeta  {
  for _, meta := range fieldsMeta {
    if meta.Name == SplitValueFieldName {
      return meta
	}
  }

  return nil
}

func getTimeSeriesMeta(name string, fieldsMeta []*FieldMeta) []*FieldMeta  {
  meta := make([]*FieldMeta, 0)
  valueFieldMeta := getValueMeta(fieldsMeta)

  if valueFieldMeta != nil {
	meta = append(meta, &FieldMeta{
	  Name: name,
	  Type: valueFieldMeta.Type,
	})
	meta = append(meta, &FieldMeta{
	  Name: SplitTimeFieldName,
	  Type: SplitTimeFieldType,
	})
  }

  return meta
}

func buildTimeSeriesFrame(refId string, name string, fieldsMeta []*FieldMeta) *ClickHouseFrame {
  meta := getTimeSeriesMeta(name, fieldsMeta)

  if len(meta) == 2 {
	return NewFrame(refId, name, meta, make([]map[string]interface{}, 0))
  } else {
	return nil
  }
}

func splitFrame(refId string, fieldsMeta []*FieldMeta, data []map[string]interface{}) []*ClickHouseFrame {
  if shouldSplit(fieldsMeta) {
	frames := make(map[string]*ClickHouseFrame, 0)

	for _, row := range data {
	  label, labelErr := getLabel(row)
	  timeValue, timeErr := getTime(row)
	  value, valueOk := row[SplitValueFieldName]

	  if labelErr == nil && timeErr == nil && valueOk {
	    name := label
	    newFrame, ok := frames[name]
	    if !ok {
	      newFrame = buildTimeSeriesFrame(refId, name, fieldsMeta)
	      frames[name] = newFrame
		}

		newFrame.AddRow(map[string]interface{}{
		  SplitTimeFieldName: timeValue,
		  newFrame.Name: value,
		})
	  }
	}

	framesList := make([]*ClickHouseFrame, 0)

	for _, frame := range frames {
	  if frame != nil {
	    framesList = append(framesList, frame)
	  }
	}

	return framesList
  } else {
    return []*ClickHouseFrame{NewFrame(refId, refId, fieldsMeta, data)}
  }
}