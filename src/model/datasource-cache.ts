import { DataFrame, DataQueryRequest, DataQueryResponse, toDataFrame } from '@grafana/data';
import { ClickHouseQuery } from './model';

type Query = (request: DataQueryRequest<ClickHouseQuery>) => Promise<DataQueryResponse>;

type CacheObject = { [key: string]: {} };

type DataCache = { [key: string]: DataFrame };

type LastQuery = {
  query: ClickHouseQuery;
  time: number;
};

type QueriesCache = { [key: string]: LastQuery };

function buildDataCache(data: DataQueryResponse): DataCache {
  const cache: DataCache = {};
  data.data.forEach(d => {
    const df = toDataFrame(d);
    if (df.refId) {
      cache[df.refId] = df;
    }
  });

  return cache;
}

function buildQueriesCache(request: DataQueryRequest<ClickHouseQuery>): QueriesCache {
  const time = Date.now();
  const cache: QueriesCache = {};

  request.targets.forEach(t => {
    cache[t.refId] = {
      query: t,
      time: time,
    };
  });

  return cache;
}

function updateObject(old: CacheObject, upd: CacheObject): CacheObject {
  const keys = Object.keys(upd);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    old[key] = upd[key];
  }

  return old;
}

export class DatasourceCache {
  private readonly source: Query;
  private readonly cacheMs: number;
  private readonly data: DataCache;
  private readonly queries: QueriesCache;

  constructor(source: Query, cacheMs: number) {
    this.source = source;
    this.data = {};
    this.queries = {};
    this.cacheMs = cacheMs;
  }

  update(request: DataQueryRequest<ClickHouseQuery>, data: DataQueryResponse) {
    updateObject(this.data, buildDataCache(data));
    updateObject(this.queries, buildQueriesCache(request));
  }

  query(request: DataQueryRequest<ClickHouseQuery>): Promise<DataQueryResponse> {
    const data: DataFrame[] = [];
    const targets: ClickHouseQuery[] = [];
    const now = Date.now();

    request.targets.forEach(t => {
      const lastQuery = this.queries[t.refId];
      const q = lastQuery?.query;
      const diff = now - lastQuery?.time;

      if (lastQuery && diff < this.cacheMs && q.query === t.query && this.data[q.refId]) {
        data.push(this.data[q.refId]);
      } else {
        targets.push(t);
      }
    });

    if (targets.length) {
      request.targets = targets;
      return this.source(request).then(response => {
        response.data.forEach(d => data.push(toDataFrame(d)));
        response.data = data;
        return response;
      });
    } else {
      return Promise.resolve({
        data: data,
      });
    }
  }
}
