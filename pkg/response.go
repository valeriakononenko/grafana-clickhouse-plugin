package main

var SplitLabelFieldName = "label"
var SplitTimeFieldName = "time"
var SplitValueFieldName = "value"

func getLabel(data map[string]interface{}, defaultLabel string) string  {
  labelValue, okValue := data[SplitLabelFieldName]
  if okValue {
	label, ok := labelValue.(string)
	if ok {
	  return label
	}
  }

  return defaultLabel
}

type FieldMeta struct {
	Name	string `json:"name"`
	Type	string `json:"type"`
}

type Response struct {
	Meta	[]*FieldMeta				`json:"meta"`
	Data 	[]map[string]interface{}	`json:"data"`
}

func (r *Response) getSplitMeta() []*FieldMeta {
  fieldsSum := 0
  checkSum := 11
  meta := make([]*FieldMeta, 2)

  for _, m := range r.Meta {
	switch m.Name {
	case SplitTimeFieldName:
	  meta[0] = m
	  fieldsSum += 10
	case SplitValueFieldName:
	  meta[1] = m
	  fieldsSum += 1
	}
  }

  if fieldsSum == checkSum {
	return meta
  } else {
	return nil
  }
}

func (r *Response) split(refId string, meta []*FieldMeta, tz FetchTZ) []*ClickHouseFrame {
  frames := make(map[string]*ClickHouseFrame)

  for _, row := range r.Data {
	label := getLabel(row, refId)
	frame, ok := frames[label]

	if !ok {
	  frame = NewFrame(refId, label, meta, tz)
	  frame.UpdateValueFieldDisplayName(label)
	  frames[label] = frame
	}

	frame.AddRow(row)
  }

  framesList := make([]*ClickHouseFrame, len(frames))
  i := 0

  for _, f := range frames {
	framesList[i] = f
	i += 1
  }

  return framesList
}

func (r *Response) frame(refId string, tz FetchTZ) *ClickHouseFrame {
  frame := NewFrame(refId, refId, r.Meta, tz)

  for _, row := range r.Data {
	frame.AddRow(row)
  }

  return frame
}

func (r *Response) ToFrames(refId string, splitTs bool, tz FetchTZ) []*ClickHouseFrame {
  if len(r.Data) > 0 {

    if splitTs {
      meta := r.getSplitMeta()

      if meta != nil {
        return r.split(refId, meta, tz)
	  }
	} else {
	  return []*ClickHouseFrame{r.frame(refId, tz)}
	}
  }

  return []*ClickHouseFrame{}
}
