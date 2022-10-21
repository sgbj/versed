'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const tmp = require('tmp');
const debug = require('debug')('versed:ffmpeg');
const util = require('../util');

tmp.setGracefulCleanup();

module.exports = (context, next) => {
    if (context.input.type != 'audio' && context.input.type != 'video') {
        return next();
    }

    const source = tmp.tmpNameSync({ postfix: path.extname(context.input.filename) });
    const destination = tmp.tmpNameSync({ postfix: '.' + context.input.format });
    const mimetype = util.mimetype(destination);
    debug("destination mimetype:%o", mimetype)
    
    fs.writeFileSync(source, context.input.buffer);

    const args =  [
        '-i',
        source,
        '-strict',
        '-2'
    ]
    if (mimetype.type === 'image') {
        debug("pick first frame since output is an image")
        args.push('-frames:v', '1')        
    }
    
    args.push(destination, '-y')

    debug("args: %j", args)
    const process = childProcess.spawn('ffmpeg', args);
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
            console.log('ffmpeg exited with code %d', code)
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
                    //TODO: perhaps set format
                };
                fs.unlinkSync(destination);
            }
            fs.unlinkSync(source);
            next();
        });
    });
};
