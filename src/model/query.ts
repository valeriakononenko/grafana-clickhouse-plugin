import { DataFrame, DataQueryRequest, DataQueryResponse, toDataFrame } from '@grafana/data';
import { ClickHouseQuery } from './model';
import { renderQuery } from './templating';
import { split } from './split';

type HandleDataQueryResponse = (res: DataQueryResponse) => DataQueryResponse;

type TargetsMap = { [key: string]: ClickHouseQuery };

function mapTargets(targets: ClickHouseQuery[]): TargetsMap {
  const map: TargetsMap = {};

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];

    map[t.refId] = t;
  }

  return map;
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

export function handleDataQueryResponse(targets: ClickHouseQuery[]): HandleDataQueryResponse {
  return (response: DataQueryResponse) => {
    const targetsMap = mapTargets(targets);
    const data: DataFrame[] = [];

    response.data.forEach(d => {
      const frame = toDataFrame(d);
      const target = targetsMap[frame.refId || frame.name || ''];

      if (target && target.splitTs) {
        split(frame).forEach(f => data.push(f));
      } else {
        data.push(frame);
      }
    });

    response.data = data;

    return response;
  };
}
