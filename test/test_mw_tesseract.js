
import assert from 'assert';
import fs from 'fs';
import tesseract from '../middleware/tesseract.js';


describe('tesseract', function () {
    describe('middleware', function () {
        it('should fail on missing data"', function () {
            const context = {
                input: {
                    type: 'image',
                    filename: 'testdata/sample_text.png',
                    format: 'txt',
                    ocr: true,
                }
            };
            assert.throws(
                () => tesseract(context, ()=> {
                    assert.ok(false);
                }),
                /"data" argument/
            );
        });

        it('should ocr sample text from png"', function (done) {
            const buf = fs.readFileSync('test/fixtures/sample_text.png');
            const context = {
                input: {
                    type: 'image',
                    filename: 'sample_text.png',
                    format: 'txt',
                    ocr: true,
                    buffer: buf
                }
            };

            tesseract(context, ()=> {
                assert.ok(context.output);
                assert.ok(context.output.buffer);
                const s = context.output.buffer.toString();
                assert.match(s, /Vestibulum/);
                done();
            });
        });
    });
});
