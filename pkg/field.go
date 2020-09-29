package main

import (
  "fmt"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/grafana-plugin-sdk-go/data"
  "math"
  "strings"
  "time"
)

var datePrefix = "Date"
var dateTimePrefix = "DateTime"
var timeZonePrefix = "('"
var dateTZPrefix = datePrefix + timeZonePrefix
var dateTimeTZPrefix = dateTimePrefix + timeZonePrefix

type FetchTZ = func() *time.Location

func cutTimeZone(fieldType string) string {
  tz := ""

  if strings.HasPrefix(fieldType, dateTZPrefix) {
	tz = fieldType[len(dateTZPrefix) + 1: len(fieldType) - 2]
  } else if strings.HasPrefix(fieldType, dateTimeTZPrefix) {
	tz = fieldType[len(dateTimeTZPrefix) + 1: len(fieldType) - 2]
  }

  return strings.Trim(tz, " \t\v\n")
}

func fetchTimeZone(fieldType string, loadTZ FetchTZ) *time.Location {
  tz := cutTimeZone(fieldType)

  if tz != "" {
	return ParseTimeZone(tz)
  } else {
	return loadTZ()
  }
}


func NewField(name string, fieldType string, tz FetchTZ) *ClickHouseField {
	return &ClickHouseField{
		Name: name,
		Type: fieldType,
		Min: math.NaN(),
		Max: math.NaN(),
		TimeZone: fetchTimeZone(fieldType, tz),
	}
}

type ClickHouseField struct {
	Field *data.Field
	Name string
	Type string
	Min float64
	Max float64
	TimeZone *time.Location
}

func (f *ClickHouseField) Append(value interface{}) {
	v := ParseValue(f.Type, value, f.Name, false, f.TimeZone)
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
