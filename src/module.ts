import { DataSourcePlugin } from '@grafana/data';
import { ClickHouseDatasource } from './datasource';
import { ConfigEditor } from './editors/config-editor';
import { QueryEditor } from './editors/query/query-editor';
import { ClickHouseQuery, ClickHouseOptions } from './model/model';
import { AnnotationEditor } from './editors/annotation-editor';

export const plugin = new DataSourcePlugin<ClickHouseDatasource, ClickHouseQuery, ClickHouseOptions>(
  ClickHouseDatasource
)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor)
  .setAnnotationQueryCtrl(AnnotationEditor);
