import {
  AnnotationEvent,
  AnnotationQueryRequest,
  DataFrame,
  DataQuery,
  DataQueryRequest,
  DataSourceJsonData,
  isDataFrame,
} from '@grafana/data';
import { DataQueryResponseData } from '@grafana/data/types/datasource';

export interface ClickHouseQuery extends DataQuery {
  datasourceId: number;
  query: string;
  datasource: string;
  splitTS: boolean;
}

type ClickHouseSecureOptions = {
  password: string;
};

export interface ClickHouseOptions extends DataSourceJsonData {
  host: string;
  port: number;
  username: string;
  secureJsonData: ClickHouseSecureOptions;
}

export const Default = {
  QUERY: 'SELECT 1;',
};

export function buildAnnotationRequest(
  request: AnnotationQueryRequest<ClickHouseQuery>,
  datasourceId: number
): DataQueryRequest<ClickHouseQuery> {
  return {
    requestId: ['annotation', datasourceId, request.annotation.name].join('-'),
    targets: [
      {
        refId: request.annotation.refId || request.annotation.name,
        datasourceId: datasourceId,
        query: request.annotation.query,
        datasource: request.annotation.datasource,
      },
    ],
  } as DataQueryRequest<ClickHouseQuery>;
}

export function buildAnnotationEvent(annotation: any, data: DataFrame, i: number): AnnotationEvent | null {
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

export function buildAnnotationEvents(annotation: any, data: DataQueryResponseData): AnnotationEvent[] {
  const events: AnnotationEvent[] = [];

  if (isDataFrame(data)) {
    for (let i = 0; i < data.length; i++) {
      const event = buildAnnotationEvent(annotation, data, i);

      if (event && event.time) {
        events.push(event);
      }
    }
  }

  return events;
}
