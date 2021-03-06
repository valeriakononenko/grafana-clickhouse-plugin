import { DataFrame, DataQueryRequest, DataQueryResponse } from '@grafana/data';
import { ClickHouseQuery } from './model';
import { renderQuery } from './templating';
import { FrameAccessor } from './frame-accessor';

type HandleDataQueryResponse = (res: DataQueryResponse) => DataQueryResponse;

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
    const frames: DataFrame[] = [];

    targets.forEach(t => {
      if (!t.hide) {
        const frame = response.data.find(d => d.refId === t.refId);

        if (frame) {
          if (t.splitTs) {
            const fa = new FrameAccessor(frame);
            (fa.splitByLabel() || fa.splitByValues() || [frame]).forEach(f => frames.push(f));
          } else {
            frames.push(frame);
          }
        }
      }
    });

    response.data = frames;
    return response;
  };
}
