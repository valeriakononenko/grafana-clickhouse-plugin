import React, { ReactNode } from 'react';
import { Collapse, Switch } from '@grafana/ui';
import '../../partials/style.css';

type Props = {
  switch?: boolean;
  onSwitch?: () => void;
  collapsibleLabel: string;
  collapsibleText: ReactNode;
};

type State = {
  isOpen: boolean;
};

export class QueryOption extends React.PureComponent<Props, State> {
  onSwitch: () => void;
  hasSwitch: boolean;

  constructor(props: Props, context: React.Context<any>) {
    super(props, context);

    this.state = {
      isOpen: false,
    };

    this.hasSwitch = this.props.onSwitch !== undefined;
    this.onSwitch = this.props.onSwitch !== undefined ? this.props.onSwitch : () => {};
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
        <div className="query-option-switch">
          {this.hasSwitch && <Switch css="" value={this.props.switch} onChange={() => this.onSwitch()} />}
        </div>

        <div className="query-option-collapsible">
          <Collapse
            label={this.props.collapsibleLabel}
            collapsible={true}
            isOpen={this.state.isOpen}
            onToggle={() => this.toggle()}
          >
            <div className="query-option-collapsible-text">{this.props.collapsibleText}</div>
          </Collapse>
        </div>
      </div>
    );
  }
}
