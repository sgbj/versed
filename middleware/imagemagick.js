'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const tmp = require('tmp');

tmp.setGracefulCleanup();

module.exports = (context, next) => {
    switch(context.input.mimetype) {
        case 'image/tiff':
            break;
        default:
            return next();
    }
    switch(context.input.type) {
        case 'pdf':
            break;
        default:
            return next();
    }

    const source = tmp.tmpNameSync({ postfix: path.extname(context.input.filename) });
    const destination = path.basename(source, path.extname(context.input.filename)) + '.' + context.input.format;

    fs.writeFileSync(source, context.input.buffer);

    const process = childProcess.spawn('convert', [
        source,
        destination
    ]);

    process.stdout.on('data', data => console.log(data.toString()));
    process.stderr.on('data', data => console.log(data.toString()));

    process.on('close', () => {
        fs.readFile(destination, (err, data) => {
            if (err) {
                context.error = err;
            } else {
                context.output = {
                    buffer: data
                };
                fs.unlinkSync(destination);
            }
            fs.unlinkSync(source);
            next();
        });
    });
};
