package main

var SplitLabelFieldName = "label"
var SplitTimeFieldName = "time"
var SplitValueFieldName = "value"


type FieldMeta struct {
	Name	string `json:"name"`
	Type	string `json:"type"`
}

func getLabel(data map[string]interface{}) string  {
  labelValue, okValue := data[SplitLabelFieldName]
  if okValue {
	label, ok := labelValue.(string)
	if ok {
	  return label
	}
  }

  return ""
}

func emptyResponse(meta []*FieldMeta, rows int) *Response {
  return &Response{
	Meta: meta,
	Data: make([]map[string]interface{}, rows),
	Rows: 0,
  }
}

type Response struct {
	Meta	[]*FieldMeta				`json:"meta"`
	Data 	[]map[string]interface{}	`json:"data"`
	Rows	int							`json:"rows"`
}

func (r *Response) getSplitMeta() []*FieldMeta {
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
  } else {
    return nil
  }
}

func (r *Response) getSplitName(refId string) string {
  if len(r.Data) > 0 {
	firstRow := r.Data[0]

	if firstRow != nil {
	  label := getLabel(firstRow)

	  if label != "" {
		return label
	  }
	}
  }

  return refId
}

func (r *Response) Split(split bool) []*Response {
  if split {
	meta := r.getSplitMeta()

	if meta != nil {
	  responses := make(map[string]*Response, 0)

	  for _, row := range r.Data {
		label := getLabel(row)

		if label != "" {
		  response, ok := responses[label]

		  if !ok {
			response = emptyResponse(meta, r.Rows)
			responses[label] = response
		  }

		  response.Data[response.Rows] = row
		  response.Rows += 1
		}
	  }

	  responsesList := make([]*Response, len(responses))
	  i := 0

	  for _, response := range responses {
		responsesList[i] = response
		i += 1
	  }

	  return responsesList
	}
  }

  return []*Response{r}
}

func (r *Response) ToFrame(refId string) *ClickHouseFrame {
  frame := NewFrame(refId, r.getSplitName(refId), r.Meta)

  for _, row := range r.Data {
	frame.AddRow(row)
  }

  return frame
}
