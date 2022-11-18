
import assert from 'assert';
import fs from 'fs';
import imagemagick from '../middleware/imagemagick.js';
import {fileTypeFromBuffer}  from 'file-type';


describe('imagemagick', function () {
    describe('middleware', function () {
        it('should fail on missing data', function () {
            const context = {
                id: 'should fail on missing data',
                input: {
                    type: 'image',
                    filename: 'testdata/sample_text.png',
                    format: 'jpg',
                }
            };
            assert.throws(
                () => imagemagick(context, ()=> {
                    assert.ok(false);
                }),
                /"data" argument/
            );
        });

        it('should convert png to jpeg', function (done) {
            this.timeout(5000);
            const buf = fs.readFileSync('test/fixtures/sample_text.png');

            const context = {
                id: 'should convert png to jpeg',
                input: {
                    type: 'image',
                    filename: 'test/fixtures/sample_text.png',
                    format: 'jpg',
                    buffer: buf
                }
            };
            imagemagick(context, ()=> {
                assert.ok(context.output);
                assert.ok(context.output.buffer);
                fileTypeFromBuffer(context.output.buffer)
                    .then((result) => {
                        assert.equal(result.mime, 'image/jpeg');
                        done();
                    }).catch((err) => {
                        done(err);
                    });
            });
        });
    });
});
