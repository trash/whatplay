import { Api } from './Api';
import {
    UserServerJson,
    GameLibraryEntryReferenceClient,
    AddGamePost,
    GameLibraryEntryReferenceServer
} from '@shared/models/user.model';
import { Permission } from '@shared/models/permission.model';
import { User, Auth0User } from '../models/user.model';
import { Game } from '../models/game.model';
import moment from 'moment';
import {
    updateUser,
    addGameToLibrary,
    removeGameFromLibrary
} from '../redux/user/user.actions';
import { store } from '../redux/store';
import { List } from 'immutable';
// Intermediate type just to convert the "_id" ObjectId into a string "id"
type ClientUserServer = {
    id: string;
    auth0Id: string;
    isAdmin: boolean;
    permissions: Permission[];
    gameLibrary: List<GameLibraryEntryReferenceClient>;
};

class UserService {
    async getUser(auth0Id: string): Promise<ClientUserServer> {
        const server = await Api.get<UserServerJson>(
            `/api/v1/users/${auth0Id}`
        );
        return {
            id: server._id,
            auth0Id: server.auth0Id,
            isAdmin: server.isAdmin,
            permissions: server.permissions,
            gameLibrary: List(server.gameLibrary)
        };
    }

    hasGameInLibrary(game: Game): boolean {
        return store
            .getState()
            .user.gameLibrary.some(entry => entry?.gameId === game.id);
    }

    hasPermission(user: User, permission: Permission): boolean {
        return user.permissions.includes(permission);
    }

    toggleGameFromLibrary(game: Game) {
        const hasGameInLibrary = this.hasGameInLibrary(game);
        if (hasGameInLibrary) {
            return this.removeGameFromLibrary(game);
        }
        return this.addGameToLibrary(game);
    }

    private async removeGameFromLibrary(game: Game) {
        await Api.delete(`/api/v1/users/library/${game.id}`);
        store.dispatch(removeGameFromLibrary(game.id));
        return;
    }
    private async addGameToLibrary(game: Game) {
        const server = await Api.post<
            AddGamePost,
            GameLibraryEntryReferenceServer
        >(`/api/v1/users/library`, {
            gameId: game.id
        });
        store.dispatch(addGameToLibrary(server));
        return server;
    }

    async getFullUser(auth0User: Auth0User): Promise<User> {
        const userStub = {
            auth0Id: auth0User.sub,
            name: auth0User.name,
            email: auth0User.email,
            picture: auth0User.picture,
            updatedAt: moment(auth0User.updated_at)
        };
        const userServer = await userService.getUser(userStub.auth0Id);
        const user = Object.assign({}, userStub, userServer);
        store.dispatch(updateUser(user));
        return user;
    }
}
export const userService = new UserService();
