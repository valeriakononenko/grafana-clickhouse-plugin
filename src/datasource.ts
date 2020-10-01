import {
  AnnotationEvent,
  AnnotationQueryRequest,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceInstanceSettings,
  MetricFindValue,
} from '@grafana/data';
import { ClickHouseOptions, ClickHouseQuery } from './model/model';
import { Observable, from } from 'rxjs';
import { DataSourceWithBackend } from '@grafana/runtime';
import { buildAnnotationEvents, buildAnnotationRequest } from './model/annotation';
import { buildMetricFindValues, buildMetricQueryRequest } from './model/metric';
import { buildDataQueryRequest, handleDataQueryResponse } from './model/query';
import { ignoreError } from './model/defaults';

export class ClickHouseDatasource extends DataSourceWithBackend<ClickHouseQuery, ClickHouseOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<ClickHouseOptions>) {
    super(instanceSettings);
  }

  query(request: DataQueryRequest<ClickHouseQuery>): Observable<DataQueryResponse> {
    return from(this._query(request).then(handleDataQueryResponse(request.targets)));
  }

  annotationQuery(request: AnnotationQueryRequest<ClickHouseQuery>): Promise<AnnotationEvent[]> {
    return this._query(buildAnnotationRequest(request, this.id))
      .then(buildAnnotationEvents(request.annotation))
      .catch(ignoreError([]));
  }

  metricFindQuery(query: string): Promise<MetricFindValue[]> {
    return this._query(buildMetricQueryRequest(query))
      .then(buildMetricFindValues)
      .catch(ignoreError([]));
  }

  targetContainsTemplate(query: ClickHouseQuery): boolean {
    return query.query.search('{{') !== -1;
  }

  private _query(request: DataQueryRequest<ClickHouseQuery>): Promise<DataQueryResponse> {
    return request.targets.length
      ? super.query(buildDataQueryRequest(request)).toPromise()
      : Promise.resolve({ data: [] } as DataQueryResponse);
  }
}
