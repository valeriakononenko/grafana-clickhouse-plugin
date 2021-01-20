package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
)

func parseJson(jsonData []byte, res interface{}) error {
	err := json.Unmarshal(jsonData, &res)
	if err != nil {
		return errors.New(fmt.Sprintf("Unable to parse json %s. Error: %v", jsonData, err))
	} else {
		return nil
	}
}

func main() {
	backend.Logger.Info("ClickHouse Datasource is running")
	err := datasource.Serve(GetDatasourceServeOpts())

	if err != nil {
		backend.Logger.Error(err.Error())
		os.Exit(1)
	}
}
