'use strict';

const services_config = require('../data/services.json');

function tokenize(state, start_line, end_line, silent) {

    // TODO: add support for multi-line @[codepen]{...

    let _service_keys = Object.keys(services_config);
    let _start_pos = state.bMarks[start_line] + state.tShift[start_line];
    let _max_pos = state.eMarks[start_line];
    let _pointer = { line: start_line, pos: _start_pos };

    // only allow code embeds that are either at the start of input or have a blank line preceding
    if (start_line !== 0) {
        let _prev_line_start_pos = state.bMarks[start_line - 1] + state.tShift[start_line - 1];
        let _prev_line_max_pos = state.eMarks[start_line - 1];
        if (_prev_line_max_pos > _prev_line_start_pos) {
            return false;
        }
    }

    // only allow code embeds that are either at the end of input or have a blank line following
    if (end_line !== _pointer.line + 1) {
        let _next_line_start_pos = state.bMarks[_pointer.line + 1] + state.tShift[_pointer.line + 1];
        let _next_line_max_pos = state.eMarks[_pointer.line + 1];
        if (_next_line_max_pos > _next_line_start_pos) {
            return false;
        }
    }

    // extract markup from state src
    let _markup = state.src
        .substr(_start_pos, _max_pos)
        .split(/\n/g)[0]
        .trim();

    // test markup for @[SERVICE_NAME](CONFIG)
    const _code_embed_regex = /\@\[[^\]]*\]\([^\)]*\)/;

    // only allow matches
    if (!_code_embed_regex.test(_markup)) {
        return false;
    }

    // extract service key
    const _service_key_regex = /\[[^\]]*\]/;
    let _service_key = _markup.match(_service_key_regex)[0]
        .replace(/\[/, '')
        .replace(/\]/, '');

    // only allow recognized services
    if (!_service_keys.includes(_service_key)) {
        return false;
    }

    // test markup for json config
    const _json_config_regex = /\(\{[^\}]*\}\)/;
    let _info = {
        service_key: _service_key,
        config: {}
    };

    // if has json config
    // eg. @[codepen]({"slug_hash":"ABC"})
    // ... then parse json and use as service config
    if (_json_config_regex.test(_markup)) {

        // extract json config
        let _json_config = _markup.match(_json_config_regex)[0]
            .replace(/\(/, '')
            .replace(/\)/, '');

        // parse JSON
        let _config;
        try {
            _config = JSON.parse(_json_config);
        } catch (e) {
            return false;
        }

        _info.config = _config;
    }
    // if no json config
    // eg. @[codepen](ABC,DEF)
    // ... then split config value and attempt to match values to service config keys
    else {

        const _config_regex = /\([^\)]*\)/;
        const _config = _markup.match(_config_regex)[0]
            .replace(/\(/, '')
            .replace(/\)/, '')
            .split(",");

        if (_config.length > 0) {
            _info.config.slug_hash = _config[0];

            if (_config.length > 1) {
                _info.config.pen_title = _config[1];
            }
        }
    }

    // create token
    // note:
    //   the follow push method is not Array.push
    //   it is a custom method of markdownit's StateBlock class
    //   it "pushes new token to 'stream'"
    //   and returns the new token
    let _token = state.push("code_embed", "div", 0);
    _token.markup = state.src.slice(_start_pos, _pointer.pos);
    _token.block = true;
    _token.info = _info;
    _token.map = [ start_line, _pointer.line + 1 ];

    // increment state line
    state.line = _pointer.line + 1;

    return true;
}

module.exports = {
    tokenize
};
