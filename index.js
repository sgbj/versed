'use strict';

import { readdirSync } from 'fs';
import * as url from 'node:url';
import { fileURLToPath, pathToFileURL } from 'url';
import { join, basename, extname, dirname } from 'path';
import express, { static as staticfiles, urlencoded, json } from 'express';
import multer, { memoryStorage } from 'multer';
import rfc2047 from 'rfc2047';
import Debug from 'debug';
import { mimetype as _mimetype } from './util.js';
import Middleware from './middleware.js';
import { randomUUID } from 'crypto';
import auth from './auth.js';

const debug = Debug('versed');


// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create processing pipeline
let middleware = new Middleware();


readdirSync(join(__dirname, 'middleware')).forEach(async function (file) {
    const module = await import(pathToFileURL(join(__dirname, 'middleware', file)));
    debug('imported %s as middleware', file);
    middleware.use(module.default);
});

// Create express app
const app = express();

app.use(staticfiles('public'));
app.use(urlencoded({ extended: true }));
app.use(json());
if (process.env.API_TOKEN) {
    app.use(auth);
}

const storage = memoryStorage();
const upload = multer({ storage: storage });

app.post('/convert', upload.single('file'), function (req, res) {
    const start = Date.now();
    const id = randomUUID();
    const filename = rfc2047.decode(req.file.originalname);
    const inboundMime = _mimetype(filename);
    if (!inboundMime) {
        console.error(`issues generating mimetype from '${req.file.originalname}' as ${filename}`, req.file);
    }
    debug('POST %s %s %o', id, req.path, { originalname: req.file.originalname, mimetype: inboundMime.full, ocr: req.body.ocr, size: req.file.size });

    // Run file through the pipeline
    middleware.run({
        id,
        input: {
            ...req.body,
            filename: filename,
            mimetype: inboundMime.full,
            type: inboundMime.type,
            buffer: req.file.buffer,
            ocr: req.body.ocr,
        }
    }, (context) => {
        if (context.error) {
            console.error(context.error);
        }
        const outboundMime = _mimetype(context.input.format);
        // Send the result or error
        if (context.output) {
            const head = {
                'Content-Type': outboundMime.full,
                'Content-disposition': 'attachment;filename=' + basename(context.input.filename, extname(context.input.filename))
                    + '.' + (context.output.format || req.body.format),
                'Content-Length': context.output.buffer.length
            };
            res.writeHead(200, head);
            res.end(context.output.buffer);
            debug('RESPONSE 200: %s, duration: %d ms, header: %o', id, Date.now() - start, head);
        } else {
            res.status(500).end();
            debug('RESPONSE 500: %s, duration: %d ms', id, Date.now() - start);
        }
    });
});

app.get('/ready', (req, res) => {
    res.status(200).json({ message: 'OK' });
});


function main() {
    const server = app.listen(3000, function () {
        console.log('Listening on port 3000');
        setTimeout(() => {
            app.emit('appStarted');
        }, 1000);
    });
    process.on('SIGINT', function () {
        console.log('Caught interrupt signal');
        server.close(() => {
            process.exit();
        });
    });
}

// check if main module...
if (typeof require !== 'undefined' && require.main === module) {
    // is CommonJS main
    main();
} else if (import.meta.url.startsWith('file:')) { // (A)
    // is ESM module main
    const modulePath = url.fileURLToPath(import.meta.url);
    // possibly test (import.meta.url === pathToFileURL(process.argv[1]).href)
    if (process.argv[1] === modulePath) { // (B)
        // Main ESM module
        main();
    }
}

export default app;
