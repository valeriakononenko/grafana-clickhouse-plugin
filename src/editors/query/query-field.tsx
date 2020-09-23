import { Default } from '../../model';
import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-min-noconflict/ext-language_tools';

import aceCHInfo from '../ace/clickhouse-info';
import aceCHMode from '../ace/clickhouse-mode';
import aceCHSnippets from '../ace/clickhouse-snippets';

import { config } from '@grafana/runtime';
import { QueryFieldProps } from '@grafana/ui/components/QueryField/QueryField';

interface Props extends QueryFieldProps {
  splitTs: boolean;
  onRunQuery: () => void;
  onChange: (value: string) => void;
}

export class QueryField extends React.PureComponent<Props> {
  private aceLoaded: boolean;
  private aceLoadingTries: number;

  constructor(props: Props, context: React.Context<any>) {
    super(props, context);

    this.aceLoaded = false;
    this.aceLoadingTries = 0;
    this.initAce();
  }

  onChange = (query: string): void => {
    if (query && query !== this.props.query) {
      this.props.onChange(query);
    }
  };

  runQuery = (): void => {
    this.props.onRunQuery();
  };

  private initAce(): boolean {
    if (!this.aceLoaded) {
      if (aceCHInfo() && aceCHMode() && aceCHSnippets()) {
        this.aceLoaded = true;
      } else if (this.aceLoadingTries < 3) {
        this.aceLoadingTries += 1;
        setTimeout(this.initAce, 500);
      } else {
        throw new Error('Unable to load ace partials');
      }
    }

    return this.aceLoaded;
  }

  render() {
    const query = this.props.query || Default.QUERY;

    const lines = (query.match(/\n/g) || []).length + 1;
    const heightPx = (lines > 4 ? lines * 14 : 64) + 'px';

    return (
      <div className="gf-form gf-form--grow flex-shrink-1">
        <AceEditor
          mode="clickhouse"
          theme={config.theme.isDark ? 'dracula' : 'github'}
          onChange={this.onChange}
          onBlur={this.runQuery}
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
