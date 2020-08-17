package main

import (
  "encoding/json"
  "fmt"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/grafana-plugin-sdk-go/data"
  "math"
  "reflect"
  "strconv"
  "strings"
  "time"
)

var dateLayout = "2006-01-02"
var dateTimeLayout = dateLayout + " 15:04:05"

// TODO use (value, struct) to return result
func parseValue(valueType string, value interface{}, fieldName string) (interface{}, *data.Field, float64, error)  {
  parseFloatValue := func(value interface{}) (*float64, *data.Field, float64, error)  {
    if value != nil {
	  fv := reflect.ValueOf(value).Float()
	  return &fv, data.NewField(fieldName, nil, []*float64{&fv}), fv, nil
	} else {
	  return nil, data.NewField(fieldName, nil, []*float64{nil}), math.NaN(), nil
	}
  }

  parseStringValue := func(value interface{}) (*string, *data.Field, float64, error)  {
    if value != nil {
	  sv := reflect.ValueOf(value).String()
	  return &sv, data.NewField(fieldName, nil, []*string{&sv}), math.NaN(), nil
	} else {
	  return nil, data.NewField(fieldName, nil, []*string{nil}), math.NaN(), nil
	}
  }

  parseUInt64Value := func(value interface{}) (*uint64, *data.Field, float64, error)  {
    if value != nil {
	  ui64v, err := strconv.ParseUint(fmt.Sprintf("%v", value), 10, 64)
	  if err != nil {
		return nil, nil, math.NaN(), err
	  } else {
		return &ui64v, data.NewField(fieldName, nil, []*uint64{&ui64v}), float64(ui64v), nil
	  }
	} else {
	  return nil, data.NewField(fieldName, nil, []*uint64{nil}), math.NaN(), nil
	}
  }

  parseInt64Value := func(value interface{}) (*int64, *data.Field, float64, error)  {
    if value != nil {
	  i64v, err := strconv.ParseInt(fmt.Sprintf("%v", value), 10, 64)
	  if err != nil {
		return nil, nil, math.NaN(), err
	  } else {
		return &i64v, data.NewField(fieldName, nil, []*int64{&i64v}), float64(i64v), nil
	  }
	} else {
	  return nil, data.NewField(fieldName, nil, []*int64{nil}), math.NaN(), nil
	}
  }

  // TODO pass layout as second arg - separate from valueType
  parseTime := func(value interface{}) (*time.Time, *data.Field, float64, error)  {
	layout := dateLayout
	if valueType == "DateTime" {
	  layout = dateTimeLayout
	}
	strValue := fmt.Sprintf("%v", value)
	t, err := time.Parse(layout, strValue)
	if err != nil {
	  i64v, err := strconv.ParseInt(fmt.Sprintf("%v", value), 10, 64)
	  if err != nil {
		date, err := time.Parse(dateLayout, strValue)
		if err != nil {
		  return nil, nil, math.NaN(), err
		} else {
		  return &date, data.NewField(fieldName, nil, []*time.Time{&date}), float64(date.Unix()), nil
		}
	  } else {
	    timeValue := time.Unix(i64v, i64v)
	    return &timeValue, data.NewField(fieldName, nil, []*time.Time{&timeValue}), float64(i64v), nil
	  }
	} else {
	  return &t, data.NewField(fieldName, nil, []*time.Time{&t}), float64(t.Unix()), nil
	}
  }

  if strings.HasPrefix(valueType, "LowCardinality") {
    return parseValue(strings.TrimSuffix(strings.TrimPrefix(valueType,"LowCardinality("), ")"), value, fieldName)
  } else if strings.HasPrefix(valueType, "Nullable") {
	return parseValue(strings.TrimSuffix(strings.TrimPrefix(valueType,"Nullable("), ")"), value, fieldName)
  } else {
	switch valueType {
	case "UInt8", "UInt16", "UInt32", "Int8", "Int16", "Int32", "Float32", "Float64":
	  return parseFloatValue(value)
	case "String", "UUID":
	  return parseStringValue(value)
	case "UInt64":
	  return parseUInt64Value(value)
	case "Int64":
	  return parseInt64Value(value)
	case "Date", "DateTime":
	  return parseTime(value)
	default:
	  if strings.HasPrefix(valueType, "Decimal") {
		return parseFloatValue(value)
	  } else if strings.HasPrefix(valueType, "FixedString") || strings.HasPrefix(valueType, "Enum") {
		return parseStringValue(value)
	  } else {
	    backend.Logger.Warn(
	      fmt.Sprintf("Value [%v] has compound type [%v] and will be returned as string", value, valueType))

	    byteValue, err := json.Marshal(value)
		if err != nil {
		  backend.Logger.Error(fmt.Sprintf(
			"Unable to append value of unknown type %v because of json encoding problem: %s",
			reflect.TypeOf(value), err))
		  return nil, nil, math.NaN(), err
		}

		return parseStringValue(string(byteValue))
	  }
	}
  }
}

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

func (f *ClickHouseField) Append(value interface{}) {
	v, field, fv, err := parseValue(f.Type, value, f.Name)
	if err != nil {
	  backend.Logger.Warn(
	    fmt.Sprintf("Value [%v / %v] wouln't be added to Field, because of the error: %v", value, f.Type, err))
	} else if field == nil {
	  backend.Logger.Warn(
		fmt.Sprintf("Value [%v / %v] wouln't be added to Field, because field is null", value, f.Type))
	} else {
	  if f.Field == nil {
	    f.Field = field
	  } else {
	    f.Field.Append(v)
	  }

	  if fv != math.NaN() {
		if math.IsNaN(f.Min) || fv < f.Min {
		  f.Min = fv
		}

		if math.IsNaN(f.Max) || fv > f.Max {
		  f.Max = fv
		}
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

		if f.Min != math.NaN() {
			f.Field.Config.SetMin(f.Min)
		}

		if f.Max != math.NaN() {
			f.Field.Config.SetMax(f.Max)
		}
	}

	return f.Field
}
