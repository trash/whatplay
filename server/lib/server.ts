import 'regenerator-runtime/runtime';
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../') });
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'express-jwt';
import https from 'https';
import fs from 'fs';
const jwks = require('jwks-rsa');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const port = process.env.port || process.env.PORT || 5000;

// Express settings
import { config } from './config';
import routes from './routes';
import { sslRedirectMiddleware } from './middleware/sslRedirect';

const app = express();

//webpack middleware stuff
const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../../client/webpack.config.js');

    //reload=true:Enable auto reloading when changing JS files or content
    //timeout=1000:Time from disconnecting from server to reconnecting
    config.entry.app.unshift(
        'webpack-hot-middleware/client?reload=true&timeout=1000'
    );

    //Add HMR plugin
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(config);

    //Enable "webpack-dev-middleware"
    app.use(
        webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath
        })
    );

    //Enable "webpack-hot-middleware"
    app.use(webpackHotMiddleware(compiler));
}

const jwtParameters = {
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`
};

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        jwksUri: jwtParameters.jwksUri,
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5
    }),
    audience: jwtParameters.audience,
    issuer: jwtParameters.issuer,
    algorithms: ['RS256']
});

console.log('jwt params', jwtParameters);

class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

const UnauthorizedError = 'UnauthorizedError';

// Routes requiring authorization
export const authorizedRoutes: {
    route: RegExp;
    actions: string[];
}[] = [
    {
        route: new RegExp('/api/v1/games'),
        actions: ['POST', 'DELETE', 'PATCH']
    },
    { route: new RegExp('/api/v1/users'), actions: ['GET'] }
];
app.use(sslRedirectMiddleware());
// Use JWT from auth0 for apis
app.use('/api', (req, res, next) => {
    const fullPath = `/api${req.path}`;
    const pathMatches = authorizedRoutes.find(entry =>
        fullPath.match(entry.route)
    );
    const methodMatch = pathMatches
        ? pathMatches.actions.includes(req.method)
        : false;
    if (methodMatch) {
        return jwtCheck(req, res, next);
    }
    next();
});
app.use(
    '/api',
    (err: HttpException, _req: Request, res: Response, next: NextFunction) => {
        if (err.name === UnauthorizedError) {
            return res.status(401).send();
        }
        next();
    }
);

config(app, isDev);
routes(app);

// Start server
if (isDev) {
    // Use openssl certs in develop so we're always SSL
    https
        .createServer(
            {
                key: fs.readFileSync('./key.pem'),
                cert: fs.readFileSync('./cert.pem'),
                passphrase: process.env.SSL_PASS
            },
            app
        )
        .listen(port);
} else {
    app.listen(port, function() {
        console.log(
            'Express server listening on port %d in %s mode',
            port,
            app.get('env')
        );
    });
}

// Expose app
export default app;
