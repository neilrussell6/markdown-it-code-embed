'use strict';

const sinon = require('sinon');

const TokenizerUtil = require('./tokenizer.util');

describe("TokenizerUtil", () => {

    context("tokenize", () => {

        it("should call state.push", () => {

            let _src = "@[codepen](ABC)";
            let _state = {
                src: _src,
                bMarks: [0, _src.length + 1],
                tShift: [0, 0],
                eMarks: [_src.length + 1, _src.length + 1],
                push: (a,b,c) => { return {}; }
            };
            let _spy = sinon.spy(_state, 'push');

            TokenizerUtil.tokenize(_state, 0, 1);

            sinon.assert.called(_spy);
        });
	});
});
