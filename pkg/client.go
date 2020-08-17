package main

import (
	"errors"
	"fmt"
	_ "github.com/ClickHouse/clickhouse-go"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"io/ioutil"
	"net/http"
	"net/url"
)

type ClickHouseClient struct {
	settings *DatasourceSettings
}

// TODO add https support
// TODO (minor) send query via post
func (client *ClickHouseClient) Query(query string) (*Response, error) {

	onErr := func(err error) (*Response, error) {
		backend.Logger.Error("Clickhouse client query error: " + err.Error())
		return nil, err
	}

	httpClient := &http.Client{}

	req, err := http.NewRequest(
		"GET",
		fmt.Sprintf("http://%s:%d?query=%s", client.settings.Host, client.settings.Port, url.QueryEscape(query)),
		nil); if err != nil { return onErr(err)}

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
