'use strict';

const chai = require('chai');
const deepFreeze = require('deep-freeze');

const expect = chai.expect;

const ConfigService = require('./config.service');

describe("ConfigService", () => {

    describe("populatePlaceholder", () => {

        it('should replace vars in placeholder using config values', () => {

            const _placeholder = "abc ${aaa} def ${bbb} ghi";
            const _config = {
                aaa: "ABC",
                bbb: "BCD"
            };

            deepFreeze(_config);

            let _r = ConfigService.populatePlaceholder(_placeholder, _config);

            expect(_r).to.equal("abc ABC def BCD ghi");
        });

        it('should replace vars that have no config value with empty string', () => {

            const _placeholder = "xxx ${ccc} xxx";
            const _config = {
                aaa: "ABC",
                bbb: "BCD"
            };

            deepFreeze(_config);

            let _r = ConfigService.populatePlaceholder(_placeholder, _config);

            expect(_r).to.equal("xxx  xxx");
        });
	});
});
