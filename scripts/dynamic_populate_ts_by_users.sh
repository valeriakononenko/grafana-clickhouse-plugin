
USER=$1
PASSWORD=$2

echo "CREATE TABLE IF NOT EXISTS default.ts_by_users (ts DateTime, user String, value Float64) ENGINE = Memory" | curl -s -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://localhost:8123/" --data-binary @-

INPUT_DATA=$(echo "SELECT (now(), 'user1', rand()), (now(), 'user2', rand() * 1.5), (now(), 'user3', rand() * 2)" | curl -s "http://localhost:8123" -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" --data-binary @-)


while true
do
  echo "INSERT INTO ts_by_users VALUES ${INPUT_DATA}" | curl -s -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://localhost:8123/" --data-binary @-
  echo "SELECT count(ts) FROM ts_by_users" | curl -s -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://localhost:8123" --data-binary @-
  sleep 10
done
