'use strict';

const sinon = require('sinon');
const deepFreeze = require('deep-freeze');

const CodepenUtil = require('./codepen.util.js');
const RendererUtil = require('./renderer.util');

describe("RendererUtil", () => {

    describe("render", () => {

        it('should call CodepenUtil.getEmbedCode with config', () => {

            let _spy = sinon.spy(CodepenUtil, 'getEmbedCode');

            const _key = "abc";
            const _config = { a: "A", b: "B" };
            const _tokens = {
                [ _key ]: {
                    info: {
                        service_key: RendererUtil.SERVICE_KEY_CODEPEN,
                        config: _config
                    }
                }
            };

            deepFreeze(_tokens);

            RendererUtil.render(_tokens, _key);

            sinon.assert.calledWith(_spy, _config);
        });
	});
});
