/**
 * Config file
 */

import dotenv from 'dotenv';

dotenv.config();

export default {
    db: process.env.DB,
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    port: process.env.PORT,
    allowedOrigins: ['http://localhost:4000', 'http://localhost:3000', "http://localhost:4200"]
};
