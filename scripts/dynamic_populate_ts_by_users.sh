
USER=$1
PASSWORD=$2

echo "CREATE TABLE IF NOT EXISTS default.ts_by_users (ts DateTime, user String, value Float64) ENGINE = Memory" | curl -s -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://localhost:8123/" --data-binary @-

INPUT_DATA="(now(), 'user1', rand()), (now(), 'user2', rand() * 1.5), (now(), 'user3', rand() * 2)"


while true
do
  echo "INSERT INTO ts_by_users VALUES ${INPUT_DATA}" | curl -s -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://localhost:8123/" --data-binary @-
  echo "SELECT count(ts) FROM ts_by_users" | curl -s -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://localhost:8123" --data-binary @-
  echo "SELECT ts, user FROM ts_by_users ORDER BY ts DESC LIMIT 3" | curl -s -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://localhost:8123" --data-binary @-
  sleep 10
done
