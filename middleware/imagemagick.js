'use strict';

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import tmp from 'tmp';
import Debug from 'debug';

const debug = Debug('versed:imagemagic');
tmp.setGracefulCleanup();

export default (context, next) => {
    if (context.input.type !== 'image' ) {
        return next();
    }

    const source = tmp.tmpNameSync({ postfix: path.extname(context.input.filename) });
    const destination = path.basename(source, path.extname(context.input.filename)) + '.' + context.input.format;
    debug({source, destination});

    fs.writeFileSync(source, context.input.buffer);

    const process = spawn('convert', [
        source,
        destination
    ]);
    var out = ''; // in case of exit code != 0
    const addout = (from, data) => {
        const s = data.toString();
        debug('%s: %s', from, s);
        out += s + '\n';
    };
    process.stdout.on('data', data => addout('out',data));
    process.stderr.on('data', data => addout('err', data));
    process.on('exit', (code) => {
        debug('exit: %d', code);
        if (code !== 0) {
            debug('exit code: %d', code);
            if (code !== 0) {
                console.log('imagedmagick exited with code %d', code);
                console.log(out);
            }
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
