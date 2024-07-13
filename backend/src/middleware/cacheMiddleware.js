// src/middleware/cacheMiddleware.js

import redisClient from '../config/redis.js';

const cache = (keyPrefix) => {
    return async (req, res, next) => {
        const key = `${keyPrefix}:${req.originalUrl}`;
        const cacheData = await redisClient.get(key);

        if (cacheData) {
            return res.json(JSON.parse(cacheData));
        } else {
            res.sendResponse = res.json;
            res.json = (body) => {
                redisClient.setEx(key, 3600, JSON.stringify(body)); // Cache for 1 hour
                res.sendResponse(body);
            };
            next();
        }
    };
};

export default cache;
