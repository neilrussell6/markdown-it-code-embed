'use strict';

const chai = require('chai');
const sinon = require('sinon');
const deepFreeze = require('deep-freeze');

const expect = chai.expect;

const CodepenUtil = require('./codepen.util.js');
const ConfigService = require('../services/config.service');

describe("CodepenUtil", () => {

    describe("getEmbedCode", () => {

        it('should call ConfigService.populatePlaceholder with placeholder and config', () => {

            const _placeholder = "abc";

            var ConfigServiceMock = sinon.mock(ConfigService);
            ConfigServiceMock.expects('populatePlaceholder').withArgs(_placeholder, sinon.match.any).returns("PLACEHOLDER");

            const _config = {
                a: "A",
                b: "B",
                placeholder: _placeholder
            };

            deepFreeze(_config);

            CodepenUtil.getEmbedCode(_config);

            ConfigServiceMock.restore();
            ConfigServiceMock.verify();
        });

        it('should insert config values into return value', () => {

            const _placeholder = "abc";

            var ConfigServiceMock = sinon.mock(ConfigService);
            ConfigServiceMock.expects("populatePlaceholder").returns("PLACEHOLDER");

            const _config = {
                height: 123,
                theme_id: "abc",
                slug_hash: "bcd",
                default_tab: "cde",
                user: "def",
                embed_version: "fgh",
                pen_title: "ghi",
                class: "hij",
                placeholder: _placeholder
            };

            deepFreeze(_config);

            let _r = CodepenUtil.getEmbedCode(_config);

            ConfigServiceMock.restore();

            expect(_r).to.contain(_config.height);
            expect(_r).to.contain(_config.theme_id);
            expect(_r).to.contain(_config.slug_hash);
            expect(_r).to.contain(_config.default_tab);
            expect(_r).to.contain(_config.user);
            expect(_r).to.contain(_config.embed_version);
            expect(_r).to.contain(_config.pen_title);
            expect(_r).to.contain(_config.class);
            expect(_r).to.contain(_config.placeholder);

        });
	});
});
