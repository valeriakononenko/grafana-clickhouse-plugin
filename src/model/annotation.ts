import {
  AnnotationEvent,
  AnnotationQueryRequest,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  isDataFrame,
} from '@grafana/data';
import { ClickHouseQuery, defaultClickHouseQuery, defaultQueryRequest } from './model';

type QueryResponseToAnnotationEvents = (res: DataQueryResponse) => AnnotationEvent[];

function buildAnnotationEvent(annotation: any, data: DataFrame, i: number): AnnotationEvent | null {
  const event = {
    annotation: annotation,
  } as AnnotationEvent;

  data.fields.forEach(field => {
    const fieldValue = field.values.get(i);

    if (fieldValue !== null && fieldValue !== undefined) {
      switch (field.name) {
        case 'time':
          event.time = typeof fieldValue === 'number' ? fieldValue : event.time;
          break;
        case 'title':
          event.title = typeof fieldValue === 'string' ? fieldValue : event.title;
          break;
        case 'text':
          event.text = typeof fieldValue === 'string' ? fieldValue : event.text;
          break;
        case 'tags':
          event.tags =
            typeof fieldValue === 'string'
              ? fieldValue
                  .replace('[', '')
                  .replace(']', '')
                  .split(',')
                  .map(v => v.trim())
              : event.tags;
          break;
      }
    }
  });

  if (!event.title) {
    event.title = annotation.name;
  }

  return event.time ? event : null;
}

export function buildAnnotationEvents(annotation: any): QueryResponseToAnnotationEvents {
  return (res: DataQueryResponse) => {
    const events: AnnotationEvent[] = [];

    res.data.forEach(data => {
      if (isDataFrame(data)) {
        for (let i = 0; i < data.length; i++) {
          const event = buildAnnotationEvent(annotation, data, i);

          if (event && event.time) {
            events.push(event);
          }
        }
      }
    });

    return events;
  };
}

export function buildAnnotationRequest(
  request: AnnotationQueryRequest<ClickHouseQuery>,
  datasourceId: number
): DataQueryRequest<ClickHouseQuery> {
  return defaultQueryRequest({
    range: request.range,
    dashboardId: request.dashboard?.id || 0,
    requestId: ['annotation', datasourceId, request.annotation.name].join('-'),
    targets: [
      defaultClickHouseQuery({
        refId: request.annotation.refId || request.annotation.name,
        datasourceId: datasourceId,
        datasource: request.annotation.datasource,
        query: request.annotation.query,
      }),
    ],
  });
}
