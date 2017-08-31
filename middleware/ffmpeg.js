'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const tmp = require('tmp');

tmp.setGracefulCleanup();

module.exports = (context, next) => {
    if (context.input.type != 'audio' && context.input.type != 'video') {
        return next();
    }

    const source = tmp.tmpNameSync({ postfix: path.extname(context.input.filename) });
    const destination = tmp.tmpNameSync({ postfix: '.' + context.input.format });
    
    fs.writeFileSync(source, context.input.buffer);

    const process = childProcess.spawn('ffmpeg', [
        '-i',
        source,
        '-strict',
        '-2',
        destination,
        '-y'
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
