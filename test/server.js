import got from 'got'

import {FormData, File}  from "formdata-node";
import {fileFromPath} from 'formdata-node/file-from-path';

const uri = 'http://localhost:3000/convert'

describe('App', function () {
    describe('POST /convert', function () {
      it('shoud work with docx', async function () {
        const form = new FormData()
        form.set("format", "pdf")
        form.set("file", await fileFromPath('./test/fixtures/file-sample_100kB.docx'))
        // const data = await got.post(uri, {body: form})
      });
    });
  });

