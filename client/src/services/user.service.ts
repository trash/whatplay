import { Api } from './Api';
import { UserServerJson } from '@shared/models/user.model';
import { Permission } from '@shared/models/permission.model';
import { User } from '../models/user.model';
// Intermediate type just to convert the "_id" ObjectId into a string "id"
type ClientUserServer = {
    id: string;
    auth0Id: string;
    isAdmin: boolean;
    permissions: Permission[];
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
            permissions: server.permissions
        };
    }

    hasPermission(user: User, permission: Permission): boolean {
        return user.permissions.includes(permission);
    }
}
export const userService = new UserService();
