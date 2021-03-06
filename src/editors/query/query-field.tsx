import { Default } from '../../model/defaults';
import React from 'react';
import AceEditor from 'react-ace';

import { config } from '@grafana/runtime';
import { QueryFieldProps } from '@grafana/ui/components/QueryField/QueryField';
import { loadAce } from '../ace/loader';

interface Props extends QueryFieldProps {
  onRunQuery: () => void;
  onChange: (value: string) => void;
}

export class QueryField extends React.PureComponent<Props> {
  constructor(props: Props, context: React.Context<any>) {
    super(props, context);
    loadAce();
  }

  private onChangeQuery = (query: string): void => {
    if (query && query !== this.props.query) {
      this.props.onChange(query);
    }
  };

  render() {
    const query = this.props.query || Default.QUERY;

    const lines = (query.match(/\n/g) || []).length + 1;
    const heightPx = (lines > 4 ? lines * 14 : 64) + 'px';

    return (
      <div className="gf-form gf-form--grow flex-shrink-1">
        <AceEditor
          mode="clickhouse"
          theme={config.theme.isDark ? 'dracula' : 'github'}
          onChange={(query: string) => this.onChangeQuery(query)}
          onBlur={() => this.props.onRunQuery()}
          placeholder="Enter ClickHouse query"
          value={query}
          height={heightPx}
          width="100%"
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
        />
      </div>
    );
  }
}
