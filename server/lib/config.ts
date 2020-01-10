import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import errorHandler from 'errorhandler';

const rootPath = path.normalize(__dirname + '/../../');
const clientRootPath = path.normalize(rootPath + '/client');

console.log(rootPath, clientRootPath);

/**
 * Express configuration
 */
export const config = function(
    app: express.Application,
    isDev: boolean = false
) {
    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
        if (req.url.indexOf('/scripts/') === 0) {
            res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.header('Pragma', 'no-cache');
            res.header('Expires', '0');
        }
        next();
    });

    app.use(express.static(path.join(clientRootPath, '.tmp')));
    app.use(express.static(path.join(clientRootPath, '/build')));
    app.use(express.static(path.join(clientRootPath, '/images')));
    app.use(express.static(path.join(clientRootPath, '/')));
    app.set('views', clientRootPath + '/build');

    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: true
        })
    );
    app.use(function(req, res, next) {
        // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
        res.header('Access-Control-Allow-Origin', req.header('Origin'));
        res.header(
            'Access-Control-Allow-Methods',
            'OPTIONS, GET, POST, PUT, PATCH, DELETE'
        );
        res.header(
            'Access-Control-Allow-Headers',
            'Authorization, Content-Type'
        );
        res.header('Access-Control-Allow-Credentials', 'true');

        next();
    });

    if (isDev) {
        // Error handler
        app.use(errorHandler());
    }
    // app.use(express.methodOverride());
    // app.use(express.cookieParser());
};
