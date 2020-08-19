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
	Rows	int							`json:"rows"`
}

func (r *Response) getTimeSeriesMeta(splitTs bool) []*FieldMeta {
  if splitTs {
	fieldsSum := 0
	checkSum := 111
	meta := make([]*FieldMeta, 3)

	for _, m := range r.Meta {
	  switch m.Name {
	  case SplitTimeFieldName:
		meta[0] = m
		fieldsSum += 100
	  case SplitValueFieldName:
		meta[1] = m
		fieldsSum += 10
	  case SplitLabelFieldName:
		meta[2] = m
		fieldsSum += 1
	  }
	}

	if fieldsSum == checkSum {
	  return meta
	}
  }

  return nil
}

func (r *Response) ToFrames(refId string, splitTs bool) []*ClickHouseFrame {
  meta := r.getTimeSeriesMeta(splitTs)

  if meta != nil {
	frames := make(map[string]*ClickHouseFrame)

	for _, row := range r.Data {
	  label := getLabel(row, refId)
	  frame, ok := frames[label]

	  if !ok {
		frame = NewFrame(refId, label, meta)
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
  } else {
	frame := NewFrame(refId, refId, r.Meta)

	for _, row := range r.Data {
	  frame.AddRow(row)
	}

	return []*ClickHouseFrame{frame}
  }
}
