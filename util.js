
import mime from 'mime';


export function mimetype(filename) {
    const full = mime.getType(filename);
    const parts = full.split('/');
    return {full, type: parts[0], format: parts[1]};
}
