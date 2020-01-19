import { Moment } from 'moment';
export interface User {
    id: string;
    auth0Id: string;
    name: string;
    email: string;
    picture: string;
    updatedAt: Moment;
    isAdmin: boolean;
    permissions: string[];
}
