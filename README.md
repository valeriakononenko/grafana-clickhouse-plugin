# Grafana Data Source Plugin for ClickHouse datasource with alerting

## Getting started

1. Install dependencies

    ```BASH
    npm i
    ```
2. Build plugin in development

    ```BASH
    npm run dev && npm run go
    ```
3. Build plugin in production mode

    ```BASH
    npm run build && npm run go
    ```
4. Install plugin

    ```BASH
    npm run install
    ```
   
5. Use unsigned
    ```
    sudo sed -i "s/#allow_loading_unsigned_plugins/;allow_loading_unsigned_plugins/" /etc/grafana/grafana.ini
    sudo sed -c -i "s/\(allow_loading_unsigned_plugins *= *\).*/\1wombyte-clickhouse-datasource/" /etc/grafana/grafana.ini
    sudo systemctl restart grafana-server.service 
    ```
