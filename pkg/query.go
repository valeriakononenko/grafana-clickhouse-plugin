package main

import (
  "strings"
)

var FormatJson = "FORMAT JSON"

var DefaultQuery = "SELECT 1 FORMAT JSON;"

type Query struct {
	RefId		string	`json:"refId"`
	Query 		string 	`json:"query"`
	SplitTS		bool	`json:"splitTS"`
}

func (query *Query) Format() string  {
	fmtQuery := strings.Trim(query.Query, ";\n\t ")

	if !strings.HasSuffix(fmtQuery, FormatJson) {
		fmtQuery = fmtQuery + " " + FormatJson
	}

	return fmtQuery + ";"
}
