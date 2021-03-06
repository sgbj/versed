'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const tmp = require('tmp');

tmp.setGracefulCleanup();

module.exports = (context, next) => {
    if (context.input.type == 'audio' || context.input.type == 'video' || context.input.type == 'image') {
        return next();
    }

    // Allow users to specify an output filter (e.g., rtf:"Rich Text Format")
    const outputFilter = context.input.format.split(':');
    const outputFormat = outputFilter[0];
    
    const source = tmp.tmpNameSync({ postfix: path.extname(context.input.filename) });
    const destination = path.basename(source, path.extname(context.input.filename)) + '.' + outputFormat;

    fs.writeFileSync(source, context.input.buffer);

    const params = [
        '--headless',
        '--convert-to',
        context.input.format,
        source
    ];

    // Users can also specify an input filter (e.g., writerglobal8_HTML)
    if (context.input.infilter) {
        params.unshift(`--infilter=${context.input.infilter}`);
    }

    const process = childProcess.spawn('soffice', params);
    
    process.stdout.on('data', data => console.log(data.toString()));
    process.stderr.on('data', data => console.log(data.toString()));

    process.on('close', () => {
        fs.readFile(destination, (err, data) => {
            if (err) {
                context.error = err;
            } else {
                context.output = {
                    format: outputFormat,
                    buffer: data
                };
                fs.unlinkSync(destination);
            }
            fs.unlinkSync(source);
            next();
        });
    });
};
