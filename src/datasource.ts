import {
  AnnotationEvent,
  AnnotationQueryRequest,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceInstanceSettings,
} from '@grafana/data';
import {
  buildAnnotationEvents,
  buildAnnotationRequest,
  buildDataRequest,
  ClickHouseOptions,
  ClickHouseQuery,
} from './model';
import { Observable, from } from 'rxjs';
import { DataSourceWithBackend } from '@grafana/runtime';

export class ClickHouseDatasource extends DataSourceWithBackend<ClickHouseQuery, ClickHouseOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<ClickHouseOptions>) {
    super(instanceSettings);
  }

  query(request: DataQueryRequest<ClickHouseQuery>): Observable<DataQueryResponse> {
    return from(this._query(request));
  }

  annotationQuery(request: AnnotationQueryRequest<ClickHouseQuery>): Promise<AnnotationEvent[]> {
    return this._query(buildAnnotationRequest(request, this.id))
      .then((res: DataQueryResponse) => {
        const events: AnnotationEvent[] = [];

        res.data.forEach(data =>
          buildAnnotationEvents(request.annotation, data).forEach((event: AnnotationEvent) => events.push(event))
        );

        return events;
      })
      .catch(err => {
        console.error(err);
        err.isHandled = true;
        return [];
      });
  }

  private _query(request: DataQueryRequest<ClickHouseQuery>): Promise<DataQueryResponse> {
    return request.targets.length
      ? super.query(buildDataRequest(request)).toPromise()
      : Promise.resolve({ data: [] } as DataQueryResponse);
  }
}
