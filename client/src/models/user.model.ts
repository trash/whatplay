import { Moment } from 'moment';
import { List } from 'immutable';
import { GameLibraryEntryReferenceClient } from '@shared/models/user.model';
export interface User {
    id: string;
    auth0Id: string;
    name: string;
    email: string;
    picture: string;
    updatedAt: Moment;
    isAdmin: boolean;
    permissions: string[];
    gameLibrary: List<GameLibraryEntryReferenceClient>;
}
export interface Auth0User {
    sub: string;
    name: string;
    email: string;
    picture: string;
    updated_at: string;
}
