import React from 'react';

export const QuerySplitExample = () => (
  <div>
    <p>You can split your data by two ways:</p>
    <ul>
      <li>
        <p>
          Add aliases <b>time</b>, <b>value</b> and <b>label</b> for main columns.
          <br />
          Value will be shown on graph under label.
          <br />
          Other columns will be ignored.
          <br />
          Label should be of string type.
        </p>
        <pre>
          Example: SELECT t as <u>time</u>, v as <u>value</u>, v as <u>label</u> w FROM ....
        </pre>
      </li>
      <li>
        <p>
          Add <b>time</b> alias.
          <br />
          Other values will be mapped to time and shown on graph under their name.
        </p>
        <pre>
          Example: SELECT t as <u>time</u>, u, v, w FROM ....
        </pre>
      </li>
    </ul>
  </div>
);
