import React from 'react';
import { QueryEditorProps } from '@grafana/data';
import { ClickHouseDatasource } from '../../datasource';
import { ClickHouseOptions, ClickHouseQuery } from '../../model/model';
import { InlineFormLabel } from '@grafana/ui';
import { QueryField } from './query-field';
import '../../partials/style.css';
import { QueryOption } from './query-option';
import { QueryTemplateVariables } from './query-template-variables';
import { QuerySplitExample } from './query-split-example';
import { getTemplateVariables, preloadQuery } from '../../model/templating';

type Props = QueryEditorProps<ClickHouseDatasource, ClickHouseQuery, ClickHouseOptions>;

export class QueryEditor extends React.PureComponent<Props> {
  private onChangeSplitTs() {
    const query = this.props.query;
    query.splitTs = !query.splitTs;
    this.props.onChange(query);
    this.props.onRunQuery();
  }

  private onChangeQuery(query: string) {
    const q = this.props.query;
    q.query = query;
    this.props.onChange(q);
  }

  private onRunQuery() {
    this.props.onRunQuery();
  }

  render() {
    const query = this.props.query.query;
    const request = this.props.data?.request;
    const templateVariables = request ? getTemplateVariables(request) : {};
    const variablesList = Object.keys(templateVariables).map(key => `${key} = ${templateVariables[key]}`);

    return (
      <div className="gf-form--grow">
        <div className="gf-form gf-form--grow">
          <InlineFormLabel className="query-field-label" width={3}>
            Query
          </InlineFormLabel>
          <QueryField
            query={query}
            onBlur={() => this.onRunQuery()}
            onChange={(q: string) => this.onChangeQuery(q)}
            onRunQuery={() => this.onRunQuery()}
            splitTs={this.props.query.splitTs}
            portalOrigin=""
          />
        </div>

        <QueryOption
          switch={this.props.query.splitTs}
          onSwitch={() => this.onChangeSplitTs()}
          collapsibleLabel="Split time series by label"
          collapsibleText={QuerySplitExample}
        />

        <QueryOption
          collapsibleLabel="Generated query"
          collapsibleText={() => <pre>{preloadQuery(query, request)}</pre>}
        />

        <QueryOption
          collapsibleLabel="Template variables"
          collapsibleText={() => QueryTemplateVariables(variablesList)}
        />
      </div>
    );
  }
}
