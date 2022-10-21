
const mime = require('mime');


exports.mimetype = function (filename) {
    const full = mime.getType(filename);
    const parts = full.split('/');
    return {full, type: parts[0], format: parts[1]};
}
