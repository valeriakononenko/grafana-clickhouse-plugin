import React from 'react';
import { QueryEditorProps } from '@grafana/data';
import { ClickHouseDatasource } from '../../datasource';
import { ClickHouseOptions, ClickHouseQuery, getTemplateVariables, preloadQuery } from '../../model';
import { InlineFormLabel } from '@grafana/ui';
import { QueryField } from './query-field';
import '../../partials/style.css';
import { QueryOption } from './query-option';

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
          collapsibleText={() => (
            <div>
              <p>Add aliases `time`, `value` and `label` for main columns. Label should be of string type</p>
              <pre>
                Example: SELECT t as <u>time</u>, v as <u>value</u>, user as <u>label</u> w, x FROM ....
              </pre>
            </div>
          )}
        />

        <QueryOption
          collapsibleLabel="Generated query"
          collapsibleText={() => <pre>{preloadQuery(query, request)}</pre>}
        />

        <QueryOption
          collapsibleLabel="Template variables"
          collapsibleText={() => (
            <div>
              <div>
                <p className="query-variables-note-header">
                  Note! Use triple curly braces to avoid escaping. For timezone = 'Etc/GMT-3':
                </p>
                <pre>
                  Example: SELECT {'{{{'}timezone{'}}}'}
                </pre>
              </div>

              {variablesList.length > 0 && (
                <ul className="query-variables-list">
                  {variablesList.map(variable => (
                    <li>{variable}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        />
      </div>
    );
  }
}
