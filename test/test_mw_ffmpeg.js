
import assert from 'assert';
import fs from 'fs';
import {fileTypeFromBuffer}  from 'file-type';
import ffmpeg from '../middleware/ffmpeg.js';


describe('ffmpeg', function () {
    describe('middleware', function () {
        it('should fail on missing data', function () {
            const context = {
                id: 'should fail on missing data',
                input: {
                    type: 'video',
                    filename: 'testdata/sample_640x360.mkv',
                    format: 'png',
                }
            };
            assert.throws(
                () => ffmpeg(context),
                /"data" argument/
            );
        });

        it('should convert mkv to png', function (done) {
            const buf = fs.readFileSync('test/fixtures/sample_640x360.mkv');
            const context = {
                id: 'should convert mkv to png',
                input: {
                    type: 'video',
                    filename: 'sample_640x360.mkv',
                    format: 'png',
                    buffer: buf
                }
            };
            function next() {
                assert.ok(context.output);
                assert.ok(context.output.buffer);
                fileTypeFromBuffer(context.output.buffer)
                    .then((result) => {
                        assert.equal(result.mime, 'image/png');
                        done();
                    }).catch((err) => {
                        done(err);
                    });
            }

            ffmpeg(context, next);
        });

        it('should not give any output when bad data in input', function (done) {
            //read a non video file
            const buf = fs.readFileSync('test/fixtures/file-sample_100kB.docx');
            //and present it as an video
            const context = {
                id: 'should not give any output when bad data in input',
                input: {
                    type: 'video',
                    filename: 'sample_640x360.mkv',
                    format: 'png',
                    buffer: buf
                }
            };
            function next() {
                assert.ok(!context.output);
                // assert.ok(context.err)
                done();
            }

            ffmpeg(context, next);
        });
    });
});
