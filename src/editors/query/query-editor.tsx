import React from 'react';
import { QueryEditorProps } from '@grafana/data';
import { ClickHouseDatasource } from '../../datasource';
import { ClickHouseOptions, ClickHouseQuery } from '../../model';
import { InlineFormLabel } from '@grafana/ui';
import { QueryField } from './query-field';
import '../../partials/style.css';
import { QueryOptions } from './query-options';

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

        <QueryOptions splitTs={this.props.query.splitTs} onChangeSplitTs={() => this.onChangeSplitTs()} />
      </div>
    );
  }
}
