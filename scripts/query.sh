

HOST=$1
PORT=$2
USER=$3
PASSWORD=$4
QUERY=$5

echo $QUERY | curl -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://$HOST:$PORT/" --data-binary @-
