'use strict';

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import tmp from 'tmp';
import Debug from 'debug';
import * as util from '../util.js';

const debug = Debug('versed:ffmpeg');
tmp.setGracefulCleanup();

export default (context, next) => {
    if (context.input.type !== 'audio' && context.input.type !== 'video') {
        return next();
    }
    const { id } = context;
    const source = tmp.tmpNameSync({ postfix: path.extname(context.input.filename) });
    const destination = tmp.tmpNameSync({ postfix: '.' + context.input.format });
    const mimetype = util.mimetype(destination);
    debug('%s. destination mimetype:%o', id, mimetype);

    fs.writeFileSync(source, context.input.buffer);

    const args =  [
        '-i',
        source,
        '-strict',
        '-2'
    ];
    if (mimetype.type === 'image') {
        debug('%s. pick first frame since output is an image', id);
        args.push('-frames:v', '1');
    }

    args.push(destination, '-y');

    debug('%s. args: %j', id, args);
    const process = spawn('ffmpeg', args);
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
            console.log('ffmpeg exited with code %d', code);
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
                    //TODO: perhaps set format
                };
                fs.unlinkSync(destination);
            }
            fs.unlinkSync(source);
            next();
        });
    });
};
