package main

import (
  "encoding/json"
  "fmt"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/grafana-plugin-sdk-go/data"
  "reflect"
  "strconv"
  "strings"
  "time"
)

var dateLayout = "2006-01-02"
var dateTimeLayout = dateLayout + " 15:04:05"

func ParseTimeZone(tz string) *time.Location {
  location, err := time.LoadLocation(tz)

  if err == nil {
	return location
  } else {
	return time.UTC
  }
}

func parseFloatValue(value interface{}, fieldName string, nullable bool) *Value   {
  if value != nil {
    fv := reflect.ValueOf(value).Float()

    if nullable {
	  return NewValue(&fv, fieldName, []*float64{})
	} else {
	  return NewValue(fv, fieldName, []float64{})
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
	  return NewValue(&str, fieldName, []*string{})
	} else {
	  return NewValue(str, fieldName, []string{})
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
		return NewValue(&ui64v, fieldName, []*uint64{})
	  } else {
		return NewValue(ui64v, fieldName, []uint64{})
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
		return NewValue(&i64v, fieldName, []*int64{})
	  } else {
		return NewValue(i64v, fieldName, []int64{})
	  }
	}
  } else if nullable {
	return NullValue(fieldName, []*int64{})
  }

  return nil
}

func parseTimeValue(value interface{}, fieldName string, nullable bool, layout string,
					timezone *time.Location) *Value  {
  if value != nil {
	strValue := fmt.Sprintf("%v", value)
	t, err := time.ParseInLocation(layout, strValue, timezone)

	if err == nil {
	  if nullable {
		return NewValue(&t, fieldName, []*time.Time{})
	  } else {
		return NewValue(t, fieldName, []time.Time{})
	  }
	} else {
	  i64v, err := strconv.ParseInt(strValue, 10, 64)

	  if err == nil {
		timeValue := time.Unix(i64v, i64v)

		if nullable {
		  return NewValue(&timeValue, fieldName, []*time.Time{})
		} else {
		  return NewValue(timeValue, fieldName, []time.Time{})
		}
	  }
	}
  } else if nullable {
	return NullValue(fieldName, []*time.Time{})
  }

  return nil
}

func ParseValue(valueType string, value interface{}, fieldName string, nullable bool, timezone *time.Location) *Value  {
  if strings.HasPrefix(valueType, "LowCardinality") {
	return ParseValue(strings.TrimSuffix(strings.TrimPrefix(valueType,"LowCardinality("), ")"),
	  value, fieldName, nullable, timezone)
  } else if strings.HasPrefix(valueType, "Nullable") {
	return ParseValue(strings.TrimSuffix(strings.TrimPrefix(valueType,"Nullable("), ")"),
	  value, fieldName, true, timezone)
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
	default:
	  if strings.HasPrefix(valueType, "Decimal") {
		return parseFloatValue(value, fieldName, nullable)
	  } else if strings.HasPrefix(valueType, "FixedString") || strings.HasPrefix(valueType, "Enum") {
		return parseStringValue(value, fieldName, nullable)
	  } else if strings.HasPrefix(valueType, dateTimePrefix) {
		return parseTimeValue(value, fieldName, nullable, dateTimeLayout, timezone)
	  } else if strings.HasPrefix(valueType, datePrefix) {
		return parseTimeValue(value, fieldName, nullable, dateLayout, timezone)
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
  return NewValue(nil, fieldName, fieldValues)
}

func NewValue(value interface{}, fieldName string, fieldValues interface{}) *Value {
  return &Value{
	Val: value,
	Field: data.NewField(fieldName, nil, fieldValues),
  }
}

type Value struct {
  Val interface{}
  Field *data.Field
}
