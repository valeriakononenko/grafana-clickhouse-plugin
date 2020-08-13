

USER=$1
PASSWORD=$2
QUERY=$3

echo $QUERY | curl -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://localhost:8123/" --data-binary @-
