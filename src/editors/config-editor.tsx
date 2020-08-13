import React, { FormEvent, PureComponent } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { ClickHouseOptions } from '../models/model';
import { InlineFormLabel, Input } from '@grafana/ui';

type State = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
};

interface Props extends DataSourcePluginOptionsEditorProps<ClickHouseOptions> {}

export class ConfigEditor extends PureComponent<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    const jsonData = ((props || {})['options'] || {})['jsonData'] || {};
    const secure = jsonData['secureJsonData'] || {};

    this.props.options.jsonData = jsonData;
    this.props.options.jsonData.secureJsonData = secure;

    this.state = {
      host: jsonData.host,
      port: jsonData.port,
      username: jsonData.username,
      password: secure.password,
    };
  }

  _changeProps = (state: State) => {
    this.props.options.jsonData.host = state.host || this.props.options.jsonData.host;
    this.props.options.jsonData.port = state.port || this.props.options.jsonData.port;
    this.props.options.jsonData.username = state.username || this.props.options.jsonData.username;
    this.props.options.jsonData.secureJsonData.password =
      state.password || this.props.options.jsonData.secureJsonData.password;
  };

  changeOption = (statePart: State) => {
    this.setState((prevState: State) => {
      const state = {
        host: statePart.host || prevState.host,
        port: statePart.port || prevState.port,
        username: statePart.username || prevState.username,
        password: statePart.password || prevState.password,
      };

      this._changeProps(state);
      return state;
    });
  };

  render() {
    return (
      <div>
        <h3 className="page-heading">Connection</h3>

        <div className="gf-form-group">
          <div className="gf-form max-width-30">
            <InlineFormLabel>Host</InlineFormLabel>
            <Input
              css=""
              type="text"
              placeholder="Enter a host"
              defaultValue={this.state.host}
              onBlur={(event: FormEvent<HTMLInputElement>) =>
                this.changeOption({
                  host: event.currentTarget.value,
                })
              }
              required
            />
          </div>

          <div className="gf-form max-width-30">
            <InlineFormLabel>Port</InlineFormLabel>
            <Input
              css=""
              type="number"
              placeholder="Enter a port"
              defaultValue={this.state.port}
              onBlur={(event: FormEvent<HTMLInputElement>) =>
                this.changeOption({
                  port: Number.parseInt(event.currentTarget.value, 10),
                })
              }
              required
            />
          </div>
        </div>

        <h3 className="page-heading">Authentication</h3>

        <div className="gf-form-group">
          <div className="gf-form max-width-30">
            <InlineFormLabel>Username</InlineFormLabel>
            <Input
              css=""
              type="text"
              placeholder="Enter an username"
              defaultValue={this.state.username}
              onBlur={(event: FormEvent<HTMLInputElement>) =>
                this.changeOption({
                  username: event.currentTarget.value,
                })
              }
              required
            />
          </div>
          <div className="gf-form max-width-30">
            <InlineFormLabel>Password</InlineFormLabel>
            <Input
              css=""
              type="password"
              placeholder="Enter a password"
              defaultValue={this.state.password}
              onBlur={(event: FormEvent<HTMLInputElement>) =>
                this.changeOption({
                  password: event.currentTarget.value,
                })
              }
              required
            />
          </div>
        </div>
      </div>
    );
  }
}
