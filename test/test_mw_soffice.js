
import assert from 'assert';
import fs from 'fs';
import soffice from '../middleware/soffice.js';
import {fileTypeFromBuffer}  from 'file-type';


describe('soffice', function () {
    describe('middleware', function () {
        it('should fail on missing data', function () {
            const context = {
                id: 'should fail on missing data',
                input: {
                    type: 'docx',
                    filename: 'testdata/file-sample_100kB.docx',
                    format: 'pdf',
                }
            };
            assert.throws(
                () => soffice(context, ()=> {
                    assert.ok(false);
                }),
                /"data" argument/
            );
        });

        it('should convert docx to pdf', function (done) {
            const buf = fs.readFileSync('test/fixtures/sample_text.png');
            const context = {
                id: 'should convert docx to pdf',
                input: {
                    type: 'docx',
                    filename: 'testdata/file-sample_100kB.docx',
                    format: 'pdf',
                    buffer: buf,
                }
            };

            soffice(context, ()=> {
                assert.ok(context.output);
                assert.ok(context.output.buffer);
                assert.equal(context.output.format, 'pdf');
                fileTypeFromBuffer(context.output.buffer)
                    .then((result) => {
                        assert.equal(result.mime, 'application/pdf');
                        done();
                    }).catch((err) => {
                        done(err);
                    });
            });
        });
    });
});
