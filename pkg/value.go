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

func parseFloatValue(value interface{}, fieldName string, nullable bool) *Value   {

  if value != nil {
    fv := reflect.ValueOf(value).Float()

    if nullable {
	  return &Value{
		Val: &fv,
		Field: data.NewField(fieldName, nil, []*float64{}),
		Float: fv,
	  }
	} else {
	  return &Value{
		Val: fv,
		Field: data.NewField(fieldName, nil, []float64{}),
		Float: fv,
	  }
	}
  } else if nullable {
	return NullValue(fieldName, []*float64{})
  }

  return nil
}

func parseStringValue(value interface{}, fieldName string, nullable bool) *Value   {
  if value != nil {
	str := reflect.ValueOf(value).String()

	if nullable {
	  return &Value{
		Val: &str,
		Field: data.NewField(fieldName, nil, []*string{}),
		Float: math.NaN(),
	  }
	} else {
	  return &Value{
		Val: str,
		Field: data.NewField(fieldName, nil, []string{}),
		Float: math.NaN(),
	  }
	}
  } else if nullable {
	return NullValue(fieldName, []*string{})
  }

  return nil
}

func parseUInt64Value(value interface{}, fieldName string, nullable bool) *Value  {

  if value != nil {
	ui64v, err := strconv.ParseUint(fmt.Sprintf("%v", value), 10, 64)

	if err == nil {
	  if nullable {
		return &Value{
		  Val:   &ui64v,
		  Field: data.NewField(fieldName, nil, []*uint64{}),
		  Float: float64(ui64v),
		}
	  } else {
		return &Value{
		  Val:   ui64v,
		  Field: data.NewField(fieldName, nil, []uint64{}),
		  Float: float64(ui64v),
		}
	  }
	}
  } else if nullable {
	return NullValue(fieldName, []*uint64{})
  }

  return nil
}

func parseInt64Value(value interface{}, fieldName string, nullable bool) *Value  {

  if value != nil {
	i64v, err := strconv.ParseInt(fmt.Sprintf("%v", value), 10, 64)

	if err == nil {
	  if nullable {
		return &Value{
		  Val:   &i64v,
		  Field: data.NewField(fieldName, nil, []*int64{}),
		  Float: float64(i64v),
		}
	  } else {
		return &Value{
		  Val:   i64v,
		  Field: data.NewField(fieldName, nil, []int64{}),
		  Float: float64(i64v),
		}
	  }
	}
  } else if nullable {
	return NullValue(fieldName, []*int64{})
  }

  return nil
}

func parseTimeValue(value interface{}, fieldName string, nullable bool, layout string) *Value  {

  toNullableValue := func(t time.Time) *Value {
	return &Value{
	  Val:   &t,
	  Field: data.NewField(fieldName, nil, []*time.Time{}),
	  Float: float64(t.Unix()),
	}
  }

  toValue := func(t time.Time) *Value {
	return &Value{
	  Val:   t,
	  Field: data.NewField(fieldName, nil, []time.Time{}),
	  Float: float64(t.Unix()),
	}
  }

  if value != nil {
	strValue := fmt.Sprintf("%v", value)
	t, err := time.Parse(layout, strValue)

	if err == nil {
	  if nullable {
		return toNullableValue(t)
	  } else {
		return toValue(t)
	  }
	} else {
	  i64v, err := strconv.ParseInt(strValue, 10, 64)

	  if err == nil {
		timeValue := time.Unix(i64v, i64v)

		if nullable {
		  return toNullableValue(timeValue)
		} else {
		  return toValue(timeValue)
		}
	  }
	}
  } else if nullable {
	return NullValue(fieldName, []*time.Time{})
  }

  return nil
}

func ParseValue(valueType string, value interface{}, fieldName string, nullable bool) *Value  {

  if strings.HasPrefix(valueType, "LowCardinality") {
	return ParseValue(strings.TrimSuffix(strings.TrimPrefix(valueType,"LowCardinality("), ")"),
	  value, fieldName, nullable)
  } else if strings.HasPrefix(valueType, "Nullable") {
	return ParseValue(strings.TrimSuffix(strings.TrimPrefix(valueType,"Nullable("), ")"),
	  value, fieldName, true)
  } else {
	switch valueType {
	case "UInt8", "UInt16", "UInt32", "Int8", "Int16", "Int32", "Float32", "Float64":
	  return parseFloatValue(value, fieldName, nullable)
	case "String", "UUID":
	  return parseStringValue(value, fieldName, nullable)
	case "UInt64":
	  return parseUInt64Value(value, fieldName, nullable)
	case "Int64":
	  return parseInt64Value(value, fieldName, nullable)
	case "Date":
	  return parseTimeValue(value, fieldName, nullable, dateLayout)
	case "DateTime":
	  return parseTimeValue(value, fieldName, nullable, dateTimeLayout)
	default:
	  if strings.HasPrefix(valueType, "Decimal") {
		return parseFloatValue(value, fieldName, nullable)
	  } else if strings.HasPrefix(valueType, "FixedString") || strings.HasPrefix(valueType, "Enum") {
		return parseStringValue(value, fieldName, nullable)
	  } else {
		backend.Logger.Warn(
		  fmt.Sprintf("Value [%v] has compound type [%v] and will be returned as string", value, valueType))

		byteValue, err := json.Marshal(value)
		if err != nil {
		  backend.Logger.Warn(fmt.Sprintf(
			"Unable to append value of unknown type %v because of json encoding problem: %s",
			reflect.TypeOf(value), err))
		  return nil
		}

		return parseStringValue(string(byteValue), fieldName, nullable)
	  }
	}
  }
}

func NullValue(fieldName string, fieldValues interface{}) *Value {
  return &Value{
	Val: nil,
	Field: data.NewField(fieldName, nil, fieldValues),
	Float: math.NaN(),
  }
}

type Value struct {
  Val interface{}
  Field *data.Field
  Float float64
}
