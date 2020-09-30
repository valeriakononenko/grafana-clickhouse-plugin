import React from 'react';

export const QuerySplitExample = () => (
  <div>
    <p>
      Add aliases <b>time</b>, <b>value</b> and <b>label</b> for main columns. Label should be of string type
    </p>
    <pre>
      Example: SELECT t as <u>time</u>, v as <u>value</u>, user as <u>label</u> w, x FROM ....
    </pre>
  </div>
);
