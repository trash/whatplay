import 'regenerator-runtime/runtime';
const path = require('path');
const dotEnvPath = path.resolve(__dirname, '../../.env');
require('dotenv').config({ path: dotEnvPath, debug: true });
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'express-jwt';
import https from 'https';
import fs from 'fs';
import { pathToRegexp } from 'path-to-regexp';
const jwks = require('jwks-rsa');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const port = process.env.port || process.env.PORT || 5001;

// Express settings
import { config } from './config';
import routes from './routes';

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

const jwtOptions = (credentialsRequired: boolean = true) => ({
    credentialsRequired,
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

const jwtCheckLoggedInUserRequired = jwt(jwtOptions());
const jwtCheck = jwt(jwtOptions(false));
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

type HttpVerbs = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

// Routes requiring authorization
export const authorizedRoutes: {
    route: RegExp;
    actions: HttpVerbs[];
}[] = [
    {
        route: pathToRegexp('/api/v1/games'),
        actions: ['POST']
    },
    {
        route: pathToRegexp('/api/v1/games/:id'),
        actions: ['DELETE', 'PATCH']
    },
    {
        route: pathToRegexp('/api/v1/library'),
        actions: ['POST']
    },
    {
        route: pathToRegexp('/api/v1/library/exactMatch'),
        actions: ['GET']
    },
    {
        route: pathToRegexp('/api/v1/library/:id'),
        actions: ['DELETE', 'PATCH']
    },
    {
        route: pathToRegexp('/api/v1/users/:auth0Id'),
        actions: ['GET']
    }
];

// app.use(sslRedirectMiddleware());

// Use JWT from auth0 for apis
app.use('/api', (req, res, next) => {
    const fullPath = `/api${req.path}`;
    const pathMatches = authorizedRoutes.find(entry =>
        fullPath.match(entry.route)
    );
    const methodMatch = pathMatches
        ? pathMatches.actions.includes(req.method as HttpVerbs)
        : false;
    // console.log('fullPath', fullPath);
    // console.log('pathMatches', pathMatches);
    // console.log('methodMatch', methodMatch);

    // If it's a protected route require creds
    if (methodMatch) {
        return jwtCheckLoggedInUserRequired(req, res, next);
    }
    // Still use the jwt check that adds the "req.user" object
    return jwtCheck(req, res, next);
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
