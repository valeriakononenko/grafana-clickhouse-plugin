import { DataQueryRequest, dateTime, ScopedVars, TimeRange } from '@grafana/data';
import { ClickHouseQuery } from './model';

export const Default = {
  QUERY: 'SELECT 1;',
  BROWSER_TIMEZONE: 'browser',
  ALL_VARIABLE: '$__all',
  TIMEZONE_OFFSET: 'Etc/GMT',
};

function makeTimeRange(from: number, to: number): TimeRange {
  return {
    from: dateTime(from),
    to: dateTime(to),
    raw: { from: `${from}`, to: `${to}` },
  };
}

export function defaultClickHouseQuery(q: Partial<ClickHouseQuery>): ClickHouseQuery {
  return {
    datasource: q.datasource || '',
    datasourceId: q.datasourceId || 0,
    query: q.query || Default.QUERY,
    refId: q.refId || '',
    splitTs: q.splitTs || false,

    hide: q.hide || false,
    key: q.key || '',
    queryType: q.queryType || '',
  };
}

export function defaultQueryRequest(qr: Partial<DataQueryRequest<ClickHouseQuery>>): DataQueryRequest<ClickHouseQuery> {
  const range = qr.range || makeTimeRange(0, Date.now());

  return {
    app: qr.app || '',
    dashboardId: qr.dashboardId || 0,
    interval: qr.interval || '',
    panelId: qr.panelId || 0,
    range: range,
    requestId: qr.requestId || '',
    scopedVars: qr.scopedVars || ({} as ScopedVars),
    startTime: qr.startTime || Date.now(),
    targets: qr.targets || [],
    timezone: qr.timezone || '',

    intervalMs: qr.intervalMs || 0,
    maxDataPoints: qr.maxDataPoints || Date.now(),
    reverse: qr.reverse || false,
    cacheTimeout: qr.cacheTimeout || '',
    rangeRaw: range.raw,
    timeInfo: qr.timeInfo || '',
    endTime: qr.endTime || Date.now() + 3600,
  };
}

export function ignoreError(result: any) {
  return (error: any) => {
    console.error(error);

    if (error && error.isHandled) {
      error.isHandled = true;
    }

    return result;
  };
}
