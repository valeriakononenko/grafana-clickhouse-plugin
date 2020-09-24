import React from 'react';
import { QueryEditorProps } from '@grafana/data';
import { ClickHouseDatasource } from '../../datasource';
import { ClickHouseOptions, ClickHouseQuery, renderQuery } from '../../model';
import { InlineFormLabel } from '@grafana/ui';
import { QueryField } from './query-field';
import '../../partials/style.css';
import { QueryOption } from './query-option';

type Props = QueryEditorProps<ClickHouseDatasource, ClickHouseQuery, ClickHouseOptions>;

export class QueryEditor extends React.PureComponent<Props> {
  onChangeSplitTs() {
    const query = this.props.query;
    query.splitTs = !query.splitTs;
    this.props.onChange(query);
    this.props.onRunQuery();
  }

  onChangeQuery(query: string) {
    const q = this.props.query;
    q.query = query;
    this.props.onChange(q);
  }

  render() {
    const request = this.props.data?.request;
    const preloadedQuery = request ? renderQuery(this.props.query.query, request) : 'Loading ...';

    return (
      <div className="gf-form--grow">
        <div className="gf-form gf-form--grow">
          <InlineFormLabel className="query-field-label" width={3}>
            Query
          </InlineFormLabel>
          <QueryField
            query={this.props.query.query}
            onBlur={this.props.onRunQuery}
            onChange={(q: string) => this.onChangeQuery(q)}
            onRunQuery={this.props.onRunQuery}
            splitTs={this.props.query.splitTs}
            portalOrigin=""
          />
        </div>

        <QueryOption
          switch={this.props.query.splitTs}
          onSwitch={() => this.onChangeSplitTs()}
          collapsibleLabel="Split time series by label"
          collapsibleText={
            <div>
              <p>Add aliases for time, value and label for main columns. Label should be of string type</p>
              <pre>
                Example: SELECT t as <u>time</u>, v as <u>value</u>, user as <u>label</u> w, x FROM ....
              </pre>
            </div>
          }
        />

        <QueryOption collapsibleLabel="Generated query" collapsibleText={<pre>{preloadedQuery}</pre>} />
      </div>
    );
  }
}
