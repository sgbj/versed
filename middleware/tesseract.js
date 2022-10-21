'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const tmp = require('tmp');
const debug = require('debug')('versed:tesseract');

tmp.setGracefulCleanup();

module.exports = (context, next) => {
    if (!context.input.ocr || context.input.type == 'audio' || context.input.type == 'video') {
        return next();
    }

    const source = tmp.tmpNameSync({ postfix: path.extname(context.input.filename) });
    const outputbase = path.dirname(source) + '/' + path.basename(source, path.extname(context.input.filename));
    const destination = outputbase + '.' + context.input.format;

    debug('filename:', context.input.filename );
    debug({source, outputbase, destination});

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
    debug('args: %o', args)
    const process = childProcess.spawn('tesseract', args );
    var out = ''; // in case of exit code != 0
    const addout = (from, data) => {
        const s = data.toString()
        debug("%s: %s", from, s)
        out += s + '\n'
    }
    process.stdout.on('data', data => addout('out', data));
    process.stderr.on('data', data => addout('err', data));
    process.on('exit', (code) => {
        debug('exit code: %d', code)
        if (code !== 0) {
            console.log('tesseract exited with code %d', code)
            console.log(out)
        }
    });

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
