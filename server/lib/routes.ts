import { Application, Response } from 'express';
import { api } from './controllers/api';
import { index } from './controllers/index';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../openapi.json';
import { ControllerMethod } from './controllers/ControllerMethod';
import { AuthenticatedRequest } from './controllers/AuthenticatedRequest';

function requirePermissions(permission: string, cb: ControllerMethod) {
    return (req: AuthenticatedRequest, res: Response) => {
        if (!req.user || !req.user.permissions.includes(permission)) {
            const errorMessage = `Missing proper permissions: ${permission}`;
            return res.status(403).send(errorMessage);
        }
        cb(req, res);
    };
}

/**
 * Application routes
 */
export default function(app: Application) {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.get('/api/v1/users/:auth0Id', (req, res) => api.user.getUser(req, res));

    app.get('/api/v1/games', (req, res) => {
        api.game.getAllGames(req, res);
    });
    app.post(
        '/api/v1/games',
        requirePermissions('create:game', (req, res) =>
            api.game.createGame(req, res)
        )
    );
    app.delete(
        '/api/v1/games/:id',
        requirePermissions('delete:game', (req, res) =>
            api.game.deleteGame(req, res)
        )
    );
    app.patch(
        '/api/v1/games/:id',
        requirePermissions('update:game', (req, res) =>
            api.game.updateGame(req, res)
        )
    );
    app.all('/api/*', (_req, res) => res.status(404).send());

    app.get('/*', index);
}
