'use strict';

export default (req, res, next) => {
    // readiness endpoint should be whitelisted
    if (req.url.startsWith('/ready')) {
        return next();
    }
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: 'Access Denied. Missing authorization header' });
    }

    const auth = authToken.split(' ');
    if (auth.length !== 2 || auth[0].toLowerCase() !== 'bearer' || auth[1] !== process.env.API_TOKEN) {
        res.status(401).json({ error: 'Access Denied. Invalid bearer token supplied' });
    } else {
        next();
    }
};
