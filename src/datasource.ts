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
import { DatasourceCache } from './model/datasource-cache';

export class ClickHouseDatasource extends DataSourceWithBackend<ClickHouseQuery, ClickHouseOptions> {
  private cache: DatasourceCache;
  private static cacheMs: number = 30 * 1000;

  constructor(instanceSettings: DataSourceInstanceSettings<ClickHouseOptions>) {
    super(instanceSettings);
    this.cache = new DatasourceCache(req => this._query(req), ClickHouseDatasource.cacheMs);
  }

  query(request: DataQueryRequest<ClickHouseQuery>): Observable<DataQueryResponse> {
    return from(this._queryCached(request).then(handleDataQueryResponse(request.targets)));
  }

  annotationQuery(request: AnnotationQueryRequest<ClickHouseQuery>): Promise<AnnotationEvent[]> {
    return this._query(buildAnnotationRequest(request, this.id))
      .then(buildAnnotationEvents(request.annotation))
      .catch(ignoreError([], 'annotationQuery error'));
  }

  metricFindQuery(query: string): Promise<MetricFindValue[]> {
    return this._query(buildMetricQueryRequest(query))
      .then(buildMetricFindValues)
      .catch(ignoreError([], 'metricFindQuery error'));
  }

  targetContainsTemplate(query: ClickHouseQuery): boolean {
    return query.query.search('{{') !== -1;
  }

  private _query(request: DataQueryRequest<ClickHouseQuery>): Promise<DataQueryResponse> {
    return request.targets.length
      ? super.query(buildDataQueryRequest(request)).toPromise()
      : Promise.resolve({ data: [] } as DataQueryResponse);
  }

  private _queryCached(request: DataQueryRequest<ClickHouseQuery>): Promise<DataQueryResponse> {
    return this.cache
      .query(buildDataQueryRequest(request))
      .catch(_ => this._query(request))
      .then(response => {
        this.cache.update(request, response);
        return response;
      });
  }
}
