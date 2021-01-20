
## Getting started

1. If you want to build this project from scratch, just run
    ```
    npm run pack
    ```

2. If you want to run plugin
    ```
    npm run load
    ```

3. The following step could be run instead of two previous. 
Then you will have fully installed plugin on active grafana-server
    ```
    npm run start
    ```

---
Run clickhouse in docker:
```
docker pull yandex/clickhouse-server
sudo mkdir /var/lib/clickhouse
sudo docker run -d --name clickhouse --ulimit nofile=262144:262144 -p 8123:8123 -v /var/lib/clickhouse:/var/lib/clickhouse yandex/clickhouse-server
```
