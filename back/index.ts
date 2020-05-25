import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from './config';
import { ApolloServer  } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import * as http from 'http';
import schema from './src/graphql/schema';
import auth from './src/middleware';

/**
 * Promisify All The Mongoose
 */
Promise.promisifyAll(mongoose);

/**
 * Connecting Mongoose
 */
mongoose.connect(config.db as string, {
    bufferMaxEntries: 0,
    keepAlive: true,
    reconnectInterval: 500,
    reconnectTries: 30,
    socketTimeoutMS: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/**
 * Throw error when not able to connect to database
 */
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.db}`);
});

/**
 * Initialize server
 */
const app: Express = express();
const server = new ApolloServer(schema);
let httpServer: http.Server;

app.use(cors({
    origin(origin, callback) {

        /**
         * Allow requests with no origin
         */

        if (!origin) { return callback(null, true); }
        if (config.allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

/**
 *  Middlerware for extracting authToken
 */

app.use(auth);
app.use(bodyParser.json({limit: '1mb'}));

server.applyMiddleware({ app });
httpServer = http.createServer(app);

/**
 * Listen to port
 */

app.listen(process.env.PORT || config.port, () => {
    console.log(`Server ready at ${config.port}`);
});
