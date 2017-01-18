'use strict';

const TokenizerUtil = require('./utils/tokenizer.util');
const RendererUtil = require('./utils/renderer.util');
const ConfigService = require('./services/config.service');

function plugin(md, config) {

    ConfigService.config = config;

    md.block.ruler.before('fence', 'code_embed', TokenizerUtil.tokenize, {
        alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
    });
    md.renderer.rules.code_embed = RendererUtil.render;
}

module.exports = plugin;
