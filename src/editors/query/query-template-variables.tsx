import React from 'react';
import { Icon } from '@grafana/ui';

export const QueryTemplateVariables = (variablesList: string[]) => {
  return (
    <div>
      <div className="query-variables-header">
        <Icon name="exclamation-triangle" />
        <p className="query-variables-header-text">Do not use templates with alerting</p>
      </div>

      <div className="query-variables-header">
        <Icon name="exclamation-triangle" />
        <p className="query-variables-header-text">
          Use triple curly braces to avoid escaping. For timezone = 'Etc/GMT-3':
        </p>
      </div>
      <pre>
        Example: SELECT {'{{{'}timezone{'}}}'}
      </pre>

      {variablesList.length > 0 && (
        <ul className="query-variables-list">
          {variablesList.map(variable => (
            <li>{variable}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
