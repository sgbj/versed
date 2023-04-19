'use strict';

import dotenv from 'dotenv';
dotenv.config();

export default (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        res.status(401);
        return res.send('Access Denied. Missing authorization header');
    }

    if (authToken.replace('Bearer ', '') !== process.env.API_TOKEN) {
        res.status(401);
        res.send('Access Denied. Invalid bearer token supplied');
    } else {
        next();
    }
};
