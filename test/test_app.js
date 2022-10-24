import got from 'got';
import assert from 'assert';
import {FormData}  from 'formdata-node';
import {fileFromPath} from 'formdata-node/file-from-path';
import app from '../index.js';


const uri = 'http://localhost:3001/convert';

var server;
before(function (done) {
    server = app.listen(3001, ()=> {
        done();
    });
});

after(function(done) {
    server.close(()=>{
        done();
    });
});

describe('App', function () {
    describe('POST /convert', function () {
        it('shoud work with docx to pdf', async function () {
            const form = new FormData();
            form.set('format', 'pdf');
            form.set('file', await fileFromPath('./test/fixtures/file-sample_100kB.docx'));
            const data = await got.post(uri, {body: form});
            assert.equal(data.headers['content-disposition'], 'attachment;filename=file-sample_100kB.pdf');

            return true;
        });

        it('shoud work with mkv to png', async function () {
            const form = new FormData();
            form.set('format', 'png');
            form.set('file', await fileFromPath('./test/fixtures/sample_640x360.mkv'));
            const data = await got.post(uri, {body: form});
            assert.equal(data.headers['content-disposition'], 'attachment;filename=sample_640x360.png');

            return true;
        });
    });
});

