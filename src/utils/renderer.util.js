'use strict';

const CodepenUtil = require('./codepen.util.js');
const SERVICE_KEY_CODEPEN = 'codepen';
const UTILS = {
    [ SERVICE_KEY_CODEPEN ]: CodepenUtil
};

function render(tokens, key, options, _env) {

    let _token = tokens[key];

    let _util = UTILS[ _token.info.service_key ];
    let _config = _token.info.config;

    return _util.getEmbedCode(_config);
}

module.exports = {
    SERVICE_KEY_CODEPEN,
    render
};
