import React from 'react';
import { Collapse, Switch } from '@grafana/ui';
import '../../partials/style.css';

type Props = {
  splitTS: boolean;
  onChangeSplitTs: () => void;
};

type State = {
  isOpen: boolean;
};

export class QueryOptions extends React.PureComponent<Props, State> {
  constructor(props: Props, context: React.Context<any>) {
    super(props, context);

    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    this.setState((prevState: State) => {
      return {
        isOpen: !prevState.isOpen,
      };
    });
  }

  render() {
    return (
      <div className="gf-form gf-form--grow">
        <div className="query-options-switch">
          <Switch css="" value={this.props.splitTS} onChange={event => this.props.onChangeSplitTs()} />
        </div>

        <div className="query-options">
          <Collapse
            label="Split timeseries by label"
            collapsible={true}
            isOpen={this.state.isOpen}
            onToggle={() => this.toggle()}
          >
            <p>Add aliasses for time, value and label for main columns. Label should be of string type</p>
            <pre>
              Example: SELECT t as <u>time</u>, v as <u>value</u>, user as <u>label</u> w, x FROM ....
            </pre>
          </Collapse>
        </div>
      </div>
    );
  }
}
