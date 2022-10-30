import assert from 'assert';
// assert = require('assert');
import * as util from '../util.js';
// const util = require('../util.js')

describe('Util', function () {
    describe('#mimetype()', function () {
        it('should return type image of format png for "testing.png"', function () {
            const res = util.mimetype('testing.png');
            assert.equal(res.type, 'image');
            assert.equal(res.format, 'png');
        });

        it('should return type image of format png for "testing.docx"', function () {
            const res = util.mimetype('testing.docx');
            assert.equal(res.full, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            assert.equal(res.type, 'application');
            assert.equal(res.format, 'vnd.openxmlformats-officedocument.wordprocessingml.document');
        });

        it('should return type image of format png for "testing.mkv"', function () {
            const res = util.mimetype('testing.mkv');
            assert.equal(res.full, 'video/x-matroska');
            assert.equal(res.type, 'video');
            assert.equal(res.format, 'x-matroska');
        });
    });
});
