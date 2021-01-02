
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
    npm run clean && npm run build && npm run go
    ```
4. Install plugin

    ```BASH
    npm run load
    ```
   
5. Use unsigned
    ```
    sudo sed -i "s/;allow_loading_unsigned_plugins/allow_loading_unsigned_plugins/" /etc/grafana/grafana.ini
    sudo sed -c -i "s/\(allow_loading_unsigned_plugins *= *\).*/\1divergence082-clickhouse-datasource/" /etc/grafana/grafana.ini
    sudo systemctl restart grafana-server.service 
    ```

---
Run clickhouse in docker:
```
docker pull yandex/clickhouse-server
sudo mkdir /var/lib/clickhouse
sudo docker run -d --name clickhouse --ulimit nofile=262144:262144 -p 8123:8123 -v /var/lib/clickhouse:/var/lib/clickhouse yandex/clickhouse-server
```
