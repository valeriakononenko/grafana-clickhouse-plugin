import React from 'react';
import { QueryEditorProps } from '@grafana/data';
import { ClickHouseDatasource } from '../../datasource';
import { ClickHouseOptions, ClickHouseQuery } from '../../models/model';
import { InlineFormLabel } from '@grafana/ui';
import { QueryField } from './query-field';
import '../../partials/style.css';
import { QueryOptions } from './query-options';

type Props = QueryEditorProps<ClickHouseDatasource, ClickHouseQuery, ClickHouseOptions>;

export class QueryEditor extends React.PureComponent<Props> {
  onChangeSplitTs() {
    const query = this.props.query;
    query.splitTS = !query.splitTS;
    this.props.onChange(query);
    this.props.onRunQuery();
  }

  render() {
    return (
      <div className="gf-form--grow">
        <div className="gf-form gf-form--grow">
          <InlineFormLabel className="query-field-label" width={3}>
            Query
          </InlineFormLabel>
          <QueryField
            query={this.props.query}
            onBlur={this.props.onRunQuery}
            onChange={this.props.onChange}
            onRunQuery={this.props.onRunQuery}
            datasource={this.props.datasource}
            history={[]}
          />
        </div>

        <QueryOptions splitTS={this.props.query.splitTS} onChangeSplitTs={() => this.onChangeSplitTs()} />
      </div>
    );
  }
}
