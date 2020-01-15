import { Application } from 'express';
import { api } from './controllers/api';
import { index } from './controllers/index';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../openapi.json';

/**
 * Application routes
 */
export default function(app: Application) {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    // app.post('/api/v1/users', (req, res) => api.user.createUser(req, res));

    app.get('/api/v1/games', (req, res) => {
        api.game.getAllGames(req, res);
    });
    app.post('/api/v1/games', (req, res) => api.game.createGame(req, res));
    app.post('/api/v1/games', (req, res) => api.game.createGame(req, res));
    app.delete('/api/v1/games/:id', (req, res) =>
        api.game.deleteGame(req, res)
    );
    app.patch('/api/v1/games/:id', (req, res) => api.game.updateGame(req, res));
    app.all('/api/*', (_req, res) => res.status(404).send());

    app.get('/*', index);
}
