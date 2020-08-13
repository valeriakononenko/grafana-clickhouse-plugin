
USER=$1
PASSWORD=$2

echo "CREATE TABLE IF NOT EXISTS default.ts_by_users (ts DateTime, user String, value Float64) ENGINE = Memory" | curl -s -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://localhost:8123/" --data-binary @-

for N in 0 1 2 3 4 5 6
do
  echo "$N"
	INPUT_DATA=$(echo "SELECT (toDateTime(addMinutes(now(), -$N)), 'user1', rand()), (toDateTime(addMinutes(now(), -$N)), 'user2', rand() * 1.5), (toDateTime(addMinutes(now(), -$N)), 'user3', rand() * 2)" | curl -s "http://localhost:8123" -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" --data-binary @-)
	echo "INSERT INTO ts_by_users VALUES ${INPUT_DATA}" | curl -s -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://localhost:8123/" --data-binary @-

	echo "SELECT count(ts) FROM ts_by_users" | curl -s -H "X-ClickHouse-User: $USER" -H "X-ClickHouse-Key: $PASSWORD" "http://localhost:8123" --data-binary @-
done
