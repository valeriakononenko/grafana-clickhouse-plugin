package main

import (
  "bytes"
  "errors"
  "fmt"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "io/ioutil"
  "net/http"
)

type ClickHouseClient struct {
	settings *DatasourceSettings
}

// TODO add https support
func (client *ClickHouseClient) Query(query string) (*Response, error) {

	onErr := func(err error) (*Response, error) {
		backend.Logger.Error("Clickhouse client query error: " + err.Error())
		return nil, err
	}

	httpClient := &http.Client{}

	req, err := http.NewRequest(
		"POST",
		fmt.Sprintf("http://%s:%d", client.settings.Host, client.settings.Port),
		bytes.NewBufferString(query)); if err != nil { return onErr(err)}

	req.Header.Set("X-ClickHouse-User", client.settings.Username)
	req.Header.Set("X-ClickHouse-Key", client.settings.Secure.Password)

	resp, err := httpClient.Do(req); if err != nil { return onErr(err) }
	body, err := ioutil.ReadAll(resp.Body); if err != nil { return onErr(err) }

	if resp.StatusCode != 200 {
		return onErr(errors.New(string(body)))
	}

	var jsonResp = Response{}
	jsonErr := parseJson(body, &jsonResp); if jsonErr != nil { return onErr(jsonErr) }

	return &jsonResp, nil
}
