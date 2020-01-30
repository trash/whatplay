import { Moment } from 'moment';
import { List } from 'immutable';
import { GameLibraryEntryReferenceClient } from '@shared/models/user.model';
import { Game } from './game.model';
import { GameLibraryEntryClient } from '@shared/models/game-library-entry.model';
export interface User {
    id: string;
    auth0Id: string;
    name: string;
    email: string;
    picture: string;
    updatedAt: Moment;
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

export type HydratedGameLibraryEntryClient = {
    game: Game;
    gameLibraryEntry: GameLibraryEntryClient;
};

export type HydratedGameLibraryClient = List<HydratedGameLibraryEntryClient>;
