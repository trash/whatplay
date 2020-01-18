import { Api } from './Api';
import { UserServerJson } from '@shared/models/user.model';
// Intermediate type just to convert the "_id" ObjectId into a string "id"
type ClientUserServer = {
    id: string;
    auth0Id: string;
};

class UserService {
    async getUser(auth0Id: string): Promise<ClientUserServer> {
        const server = await Api.get<UserServerJson>(
            `/api/v1/users/${auth0Id}`
        );
        return {
            id: server._id,
            auth0Id: server.auth0Id
        };
    }
}
export const userService = new UserService();
