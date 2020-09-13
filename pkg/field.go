package main

import (
  "fmt"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/grafana-plugin-sdk-go/data"
  "math"
)

var dateLayout = "2006-01-02"
var dateTimeLayout = dateLayout + " 15:04:05"


func NewField(name string, fieldType string) *ClickHouseField {
	return &ClickHouseField{
		Name: name,
		Type: fieldType,
		Min: math.NaN(),
		Max: math.NaN(),
	}
}

type ClickHouseField struct {
	Field *data.Field
	Name string
	Type string
	Min float64
	Max float64
}

func (f *ClickHouseField) Append(value interface{}, timezone string) {
	v := ParseValue(f.Type, value, f.Name, false, timezone)
	if v == nil {
	  backend.Logger.Warn(fmt.Sprintf("Value [%v / %v] wouln't be added to Field", value, f.Type))
	} else {
	  if f.Field == nil {
	    f.Field = v.Field
	  }

	  f.Field.Append(v.Val)

	  if !math.IsNaN(v.Float) {
	    f.Min = math.Min(v.Float, f.Min)
	    f.Max = math.Max(v.Float, f.Max)
	  }
	}
}

func (f *ClickHouseField) toFrameField() *data.Field  {
	if f.Field != nil {
		if f.Field.Config == nil {
			f.Field.SetConfig(&data.FieldConfig{
				DisplayName: f.Field.Name,
			})
		}

		if !math.IsNaN(f.Min) {
			f.Field.Config.SetMin(f.Min)
		}

		if !math.IsNaN(f.Max) {
			f.Field.Config.SetMax(f.Max)
		}
	}

	return f.Field
}
