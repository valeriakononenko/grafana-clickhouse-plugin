import React, { ReactNode } from 'react';
import { Collapse, Switch } from '@grafana/ui';
import '../../partials/style.css';

type Props = {
  switch?: boolean;
  onSwitch?: () => void;
  collapsibleLabel: string;
  collapsibleText: () => ReactNode;
};

type State = {
  isOpen: boolean;
  collapsibleText: ReactNode;
};

export class QueryOption extends React.PureComponent<Props, State> {
  onSwitch: () => void;
  hasSwitch: boolean;

  constructor(props: Props, context: React.Context<any>) {
    super(props, context);

    this.state = {
      isOpen: false,
      collapsibleText: this.props.collapsibleText(),
    };

    this.hasSwitch = this.props.onSwitch !== undefined;
    this.onSwitch = this.props.onSwitch !== undefined ? this.props.onSwitch : () => {};
  }

  toggle() {
    this.setState((prevState: State) => {
      const isOpen = !prevState.isOpen;
      return {
        isOpen: isOpen,
        collapsibleText: isOpen ? this.props.collapsibleText() : prevState.collapsibleText,
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
            <div className="query-option-collapsible-text">{this.state.collapsibleText}</div>
          </Collapse>
        </div>
      </div>
    );
  }
}
