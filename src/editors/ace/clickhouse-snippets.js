/**
 *
 * @returns {boolean}
 */
export default function aceCHSnippets() {
    if (window['ace']) {
        ace.define("ace/snippets/clickhouse", ["require", "exports", "module"], function (require, exports, module) {
            "use strict";

            exports.snippets = [];

            exports.scope = "clickhouse";
        });

        return true;
    } else {
        return false;
    }

}
