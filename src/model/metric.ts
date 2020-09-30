import { DataQueryRequest, DataQueryResponse, FieldType, isDataFrame, MetricFindValue } from '@grafana/data';
import { ClickHouseQuery, defaultClickHouseQuery, defaultQueryRequest } from './model';

function toLeadingZeroPositiveNumber(n: number): string {
  if (n < 10) {
    return '0' + n.toString();
  } else {
    return n.toString();
  }
}

function makeDateTimeString(time: Date): string {
  const y = time.getFullYear();
  const m = toLeadingZeroPositiveNumber(time.getMonth() + 1);
  const d = toLeadingZeroPositiveNumber(time.getDate());
  const h = toLeadingZeroPositiveNumber(time.getHours());
  const mm = toLeadingZeroPositiveNumber(time.getMinutes());
  const s = toLeadingZeroPositiveNumber(time.getSeconds());
  return `${y}-${m}-${d} ${h}:${mm}:${s}`;
}

export function buildMetricQueryRequest(query: string): DataQueryRequest<ClickHouseQuery> {
  return defaultQueryRequest({
    targets: [
      defaultClickHouseQuery({
        query: query,
      }),
    ],
  });
}

export function buildMetricFindValues(res: DataQueryResponse): MetricFindValue[] {
  const result: MetricFindValue[] = [];

  if (!res.error) {
    res.data.forEach(d => {
      if (isDataFrame(d)) {
        d.fields.forEach(f => {
          const values = f.values;

          for (let i = 0; i < d.length; i++) {
            const v = values.get(i);

            if (f.type === FieldType.time && (typeof v === 'number' || v instanceof Date)) {
              result.push({
                text: makeDateTimeString(new Date(v)),
              });
            } else {
              result.push({
                text: v.toString(),
              });
            }
          }
        });
      }
    });
  }

  return result;
}
