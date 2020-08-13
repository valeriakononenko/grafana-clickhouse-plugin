package main

type FieldMeta struct {
	Name	string `json:"name"`
	Type	string `json:"type"`
}

type Response struct {
	Meta	[]*FieldMeta				`json:"meta"`
	Data 	[]map[string]interface{}	`json:"data"`
}
