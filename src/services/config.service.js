'use strict';

let config = {};

function populatePlaceholder(placeholder, config) {

    // get unique vars in placeholder
    const _vars_regex = /\$\{[^\}]*\}/g;
    let _vars = placeholder.match(_vars_regex).reduce((result, _var) => {
        if (result.includes(_var)) {
            return result;
        }
        return [ ...result, _var ];
    }, []);

    // replace vars in placeholder
    let _var_key;
    let _replace_regex;
    let _replacement_value;

    _vars.map((_var) => {

        _var_key = _var.replace(/\$\{/, '').replace(/\}/, '');

        // if var is invalid or if no value then replace with ''
        if (!config.hasOwnProperty(_var_key) || config[ _var_key ] === null) {
            _replacement_value = '';
        } else {
            _replacement_value = config[ _var_key ];
        }

        _replace_regex = new RegExp("\\$\\{" + _var_key + "\\}", 'g');
        placeholder = placeholder.replace(_replace_regex, _replacement_value);
    });

    return placeholder;
}

module.exports = {
    config,
    populatePlaceholder
};