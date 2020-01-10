import { Request, Response, NextFunction } from 'express';

// Source: https://github.com/nodenica/node-heroku-ssl-redirect
export function sslRedirectMiddleware(
    environments: string[] = ['production'],
    status: number = 302
) {
    return function(req: Request, res: Response, next: NextFunction) {
        if (environments.indexOf(process.env.NODE_ENV!) >= 0) {
            if (req.headers['x-forwarded-proto'] !== 'https') {
                res.redirect(
                    status,
                    'https://' + req.hostname + req.originalUrl
                );
            } else {
                next();
            }
        } else {
            next();
        }
    };
}
