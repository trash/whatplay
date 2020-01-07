import { Application } from 'express';
import { api } from './controllers/api';
import { index } from './controllers/index';

/**
 * Application routes
 */
export default function(app: Application) {
    app.post('/api/v1/users', (req, res) => api.user.createUser(req, res));

    app.get('/api/v1/notes', (req, res) => {
        console.log('asdfsdfa 1');
        api.note.getAllGames(req, res);
    });
    app.post('/api/v1/notes', (req, res) => api.note.createNote(req, res));
    app.delete('/api/v1/notes/:id', (req, res) =>
        api.note.deleteNote(req, res)
    );
    app.patch('/api/v1/notes/:id', (req, res) => api.note.updateNote(req, res));

    app.get('/*', index);
}
