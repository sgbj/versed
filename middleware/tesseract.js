'use strict';

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import tmp from 'tmp';
import Debug from 'debug';

const debug = Debug('versed:tesseract');

tmp.setGracefulCleanup();

export default (context, next) => {
    if (!context.input.ocr || context.input.type === 'audio' || context.input.type === 'video') {
        return next();
    }
    const {id} = context;
    const source = tmp.tmpNameSync({ postfix: path.extname(context.input.filename) });
    const outputbase = path.dirname(source) + '/' + path.basename(source, path.extname(context.input.filename));
    const destination = outputbase + '.' + context.input.format;

    debug('%s. filename:', id, context.input.filename );
    debug('%s. %o', id, {source, outputbase, destination});

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
    debug('%s. args: %o', id, args);
    const process = spawn('tesseract', args );
    var out = ''; // in case of exit code != 0
    const addout = (from, data) => {
        const s = data.toString();
        debug('%s. %s: %s', id, from, s);
        out += s + '\n';
    };
    process.stdout.on('data', data => addout('out', data));
    process.stderr.on('data', data => addout('err', data));
    process.on('exit', (code) => {
        debug('%s. exit code: %d', id, code);
        if (code !== 0) {
            console.log('tesseract exited with code %d', code);
            console.log(out);
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
