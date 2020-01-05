import express from 'express';
import jwt from 'express-jwt';
var jwks = require('jwks-rsa');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Express settings
import { config } from './config';
import routes from './routes';

const app = express();

//webpack middleware stuff
const devServerEnabled = true;

if (devServerEnabled) {
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

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://yearinreview.auth0.com/.well-known/jwks.json'
    }),
    audience: 'localhost:8999/api',
    issuer: 'https://yearinreview.auth0.com/',
    algorithms: ['RS256']
});

// Use JWT from auth0 for apis
app.use('/api', jwtCheck);

config(app);
routes(app);

// Routing
// app.get('/*', (req, res) => res.render('index'));

const port = process.env.port || process.env.PORT || 8999;

// Start server
app.listen(port, function() {
    console.log(
        'Express server listening on port %d in %s mode',
        port,
        app.get('env')
    );
});

// Expose app
export default app;
