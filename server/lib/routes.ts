import { Application, Request, Response } from 'express';
import { api } from './controllers/api';
import { index } from './controllers/index';

import { AuthenticatedRequest } from './controllers/AuthenticatedRequest';

/**
 * Application routes
 */
export default function(app: Application) {
    app.post('/api/v1/users', (req: Request, res: Response) =>
        api.user.createUser(req, res)
    );

    app.get('/api/v1/notes', (req: AuthenticatedRequest, res: Response) => {
        console.log('asdfsdfa 1');
        api.note.getAllNotes(req, res);
    });
    app.post('/api/v1/notes', (req: Request, res: Response) =>
        api.note.createNote(req, res)
    );
    app.delete('/api/v1/notes/:id', (req: Request, res: Response) =>
        api.note.deleteNote(req, res)
    );
    app.patch('/api/v1/notes/:id', (req: Request, res: Response) =>
        api.note.updateNote(req, res)
    );

    app.get('/*', index);
}
