'use strict';

const fs = require('fs');
const path = require('path');
const mime = require('mime');
const express = require('express');
const multer  = require('multer')

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
    const mimetype = mime.getType(req.file.originalname);
    const type = mimetype.split('/')[0];

    // Run file through the pipeline
    middleware.run({
        input: {
            ...req.body,
            filename: req.file.originalname,
            mimetype: mimetype,
            type: type,
            buffer: req.file.buffer,
            ocr: req.body.ocr
        }
    }, (context) => {
        if (context.error) {
            console.error(context.error);
        }

        // Send the result or error
        if (context.output) {
            res.writeHead(200, {
                'Content-Type': mime.getType(context.input.format),
                'Content-disposition': 'attachment;filename=' 
                    + path.basename(context.input.filename, path.extname(context.input.filename)) 
                    + '.' + context.output.format || req.body.format,
                'Content-Length': context.output.buffer.length
            });
            res.end(context.output.buffer);
        } else {
            res.status(500).end();
        }
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});


process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    process.exit();
});
