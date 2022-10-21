'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const multer  = require('multer');
const rfc2047 = require('rfc2047');
const debug = require('debug')('versed')
const util = require('./util');
const Middleware = require('./middleware');

// Create processing pipeline
let middleware = new Middleware();

fs.readdirSync(path.join(__dirname, 'middleware')).forEach(function(file) {
    middleware.use(require(path.join(__dirname, 'middleware', file)));
});

// Create express app
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/convert', upload.single('file'), function (req, res, next) {
    const filename = rfc2047.decode(req.file.originalname)
    const inboundMime = util.mimetype(filename)
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
        const outboundMime = util.mimetype(context.input.format)
        // Send the result or error
        if (context.output) {           
            const head = {
                'Content-Type': outboundMime.full,
                'Content-disposition': 'attachment;filename=' + path.basename(context.input.filename, path.extname(context.input.filename))
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

const server = app.listen(3000, function () {
    console.log('Listening on port 3000');
});

module.exports = app;

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    server.close(()=> {
        process.exit();

    }
});
