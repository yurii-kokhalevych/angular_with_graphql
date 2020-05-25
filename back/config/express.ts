import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express, { Application } from 'express';
import * as http from 'http';
import schema from '../src/graphql/schema';
import auth from '../src/middleware';
import config from './index';

class Express {
    public express: Application | undefined;
    public server: ApolloServer = new ApolloServer(schema);
    public httpServer: http.Server | undefined;
    public init = (): void => {
        /**
         * Creating an express application
         */
        this.express = express();
        /**
         * Middlerware for using CORS
         */
        this.express.use(cors({
            origin(origin, callback) {
                /**
                 * Allow requests with no origin
                 * Like mobile apps or curl requests
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
        this.express.use(auth);
        this.server.applyMiddleware({ app: this.express });
        this.httpServer = http.createServer(this.express);
        /**
         * Installing subscription handlers
         */
        this.server.installSubscriptionHandlers(this.httpServer);
    }
}

export default Express;
