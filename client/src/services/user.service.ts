import { Api } from './Api';
import {
    UserServerJson,
    GameLibraryEntryReferenceClient
} from '@shared/models/user.model';
import { Permission } from '@shared/models/permission.model';
import { User, Auth0User } from '../models/user.model';
import moment from 'moment';
import { updateUser } from '../redux/user/index.actions';
import { store } from '../redux/store';
import { List } from 'immutable';
// Intermediate type just to convert the "_id" ObjectId into a string "id"
type ClientUserServer = {
    id: string;
    auth0Id: string;
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
            permissions: server.permissions,
            gameLibrary: List(server.gameLibrary)
        };
    }

    hasPermission(_user: User, _permission: Permission): boolean {
        return true;
        // return user.permissions.includes(permission);
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
