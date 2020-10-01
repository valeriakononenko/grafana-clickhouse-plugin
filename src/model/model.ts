import { DataQuery, DataSourceJsonData } from '@grafana/data';

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
