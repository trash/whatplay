import * as path from 'path';
import { Request, Response } from 'express';

/**
 * Send partial, or 404 if it doesn't exist
 */
export function partials(req: Request, res: Response) {
    var stripped = req.url.split('.')[0];
    var requestedView = path.join('./', stripped);
    res.render(requestedView, function(err: Error, html: string) {
        if (err) {
            console.log(
                "Error rendering partial '" + requestedView + "'\n",
                err
            );
            res.status(404);
            res.send(404);
        } else {
            res.send(html);
        }
    });
}

/**
 * Send our single page app
 */
export function index(_req: Request, res: Response) {
    res.render('index');
}
