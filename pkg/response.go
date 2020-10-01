package main

type FieldMeta struct {
	Name	string `json:"name"`
	Type	string `json:"type"`
}

type Response struct {
	Meta	[]*FieldMeta				`json:"meta"`
	Data 	[]map[string]interface{}	`json:"data"`
}

func (r *Response) toFrame(refId string, tz FetchTZ) *ClickHouseFrame {
  frame := NewFrame(refId, refId, r.Meta, tz)

  for _, row := range r.Data {
	frame.AddRow(row)
  }

  return frame
}
