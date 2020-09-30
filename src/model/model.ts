import { DataQuery, DataQueryRequest, DataSourceJsonData, dateTime, ScopedVars, TimeRange } from '@grafana/data';
import { renderQuery } from './templating';

type ClickHouseSecureOptions = {
  password: string;
};

export interface ClickHouseQuery extends DataQuery {
  datasourceId: number;
  query: string;
  datasource: string;
  splitTs: boolean;
}

export interface ClickHouseOptions extends DataSourceJsonData {
  host: string;
  port: number;
  username: string;
  secureJsonData: ClickHouseSecureOptions;
}

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

export function buildDataQueryRequest(request: DataQueryRequest<ClickHouseQuery>): DataQueryRequest<ClickHouseQuery> {
  const requestTargets: ClickHouseQuery[] = [];
  const targets = request.targets || [];

  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];

    if (!target.hide && target.query) {
      target.query = renderQuery(target.query, request);
      requestTargets.push(target);
    }
  }

  request.targets = requestTargets;

  return request;
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
