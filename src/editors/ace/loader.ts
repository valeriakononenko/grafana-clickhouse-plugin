import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-min-noconflict/ext-language_tools';

import aceCHInfo from '../ace/clickhouse-info';
import aceCHMode from '../ace/clickhouse-mode';
import aceCHSnippets from '../ace/clickhouse-snippets';

const Default = {
  LOADING_TIMEOUT_MS: 500,
  MAX_LOADING_TRIES: 3
}

export function loadAce(): boolean {
  let aceLoaded = false;
  let aceLoadingTries = 0;

  function load(): boolean {
    if (!aceLoaded) {
      if (aceCHInfo() && aceCHMode() && aceCHSnippets()) {
        aceLoaded = true;
      } else if (aceLoadingTries < Default.MAX_LOADING_TRIES) {
        aceLoadingTries += 1;
        setTimeout(load, Default.LOADING_TIMEOUT_MS);
      } else {
        throw new Error('Unable to load ace partials');
      }
    }

    return aceLoaded;
  }

  return load();
}
