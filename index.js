'use strict';


import { readdirSync } from 'fs';

import { fileURLToPath, pathToFileURL } from 'url';
import { join, basename, extname, dirname } from 'path';
import express, { static as staticfiles, urlencoded, json } from 'express';
import multer, { memoryStorage } from 'multer';
import rfc2047 from 'rfc2047';
import Debug from 'debug'
import { mimetype as _mimetype } from './util.js';
import Middleware from './middleware.js';
const debug = Debug('versed')


// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create processing pipeline
let middleware = new Middleware();



readdirSync(join(__dirname, 'middleware')).forEach(async function(file) {
    const module = await import(pathToFileURL(join(__dirname, 'middleware', file)))
    debug('imported %s as middleware', file)
    middleware.use(module.default);
});

// Create express app
const app = express();

app.use(staticfiles('public'));
app.use(urlencoded({extended: true}));
app.use(json());

const storage = memoryStorage();
const upload = multer({ storage: storage });

app.post('/convert', upload.single('file'), function (req, res, next) {
    const filename = rfc2047.decode(req.file.originalname)
    const inboundMime = _mimetype(filename)
    if (!inboundMime) {
        console.error(`issues generating mimetype from '${req.file.originalname}' as ${filename}`,  req.file)
    }
    
    // Run file through the pipeline
    middleware.run({
        input: {
            ...req.body,
            filename: filename,
            mimetype: inboundMime.full,
            type: inboundMime.type,
            buffer: req.file.buffer,
            ocr: req.body.ocr
        }
    }, (context) => {
        if (context.error) {
            console.error(context.error);
        }
        const outboundMime = _mimetype(context.input.format)
        // Send the result or error
        if (context.output) {           
            const head = {
                'Content-Type': outboundMime.full,
                'Content-disposition': 'attachment;filename=' + basename(context.input.filename, extname(context.input.filename))
                    + '.' + (context.output.format || req.body.format),
                'Content-Length': context.output.buffer.length
            }
            debug("response: %o", head)
            res.writeHead(200, head);
            res.end(context.output.buffer);
        } else {
            res.status(500).end();
        }
    });
});

export const server = app.listen(3000, function () {
    console.log('Listening on port 3000');
    setTimeout(()=>{
        app.emit("appStarted");
    }, 1000)
});

export default app;

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    server.close(()=> {
        process.exit();
    });
});
