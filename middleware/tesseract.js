'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const tmp = require('tmp');

tmp.setGracefulCleanup();

module.exports = (context, next) => {
    if (!context.input.ocr || context.input.type == 'audio' || context.input.type == 'video') {
        return next();
    }

    const source = tmp.tmpNameSync({ postfix: path.extname(context.input.filename) });
    const outputbase = path.dirname(source) + '/' + path.basename(source, path.extname(context.input.filename));
    const destination = outputbase + '.' + context.input.format;
    console.log("filename: " + context.input.filename );
    console.log("source: " + source );
    console.log("destination: " + destination);
    fs.writeFileSync(source, context.input.buffer);
    var args = [
        source,
        outputbase
    ];
    switch( context.input.format.toUpperCase() ) {
        case 'TXT':
            break;
        case 'TSV':
        case 'HORC':
        case 'PDF':
            args.push( context.input.format.toUpperCase() );
            break;
        default:
            return next();
    }
    const process = childProcess.spawn('tesseract', args );

    process.stdout.on('data', data => console.log(data.toString()));
    process.stderr.on('data', data => console.log(data.toString()));

    process.on('close', () => {
        fs.readFile(destination + '.' + context.input.format, (err, data) => {
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
