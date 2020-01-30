import { MongoDocument, MongoDocumentJson } from './mongoDocument';
import { Permission } from './permission.model';
import { GameServerJson } from './game.model';
import { GameLibraryEntryServerJson } from './game-library-entry.model';

export type GameLibraryEntryReferenceServer = {
    gameId: string;
    gameLibraryEntryId: string;
};
export type GameLibraryEntryReferenceClient = {
    gameId: string;
    gameLibraryEntryId: string;
};

export interface UserNotSavedServer {
    auth0Id: string;
    gameLibrary: GameLibraryEntryReferenceServer[];
}

export interface UserServer extends MongoDocument, UserNotSavedServer {}
export interface UserServerJson extends MongoDocumentJson, UserNotSavedServer {
    permissions: Permission[];
}

export type AddGamePost = {
    gameId: string;
};

export type GetGameLibraryPostClient = {
    gameLibrary: GameLibraryEntryReferenceClient[];
};

export type HydratedGameLibraryEntryServer = {
    game: GameServerJson;
    gameLibraryEntry: GameLibraryEntryServerJson;
};

export type GetGameLibraryPostServer = {
    gameLibraryEntries: HydratedGameLibraryEntryServer[];
};

export type UpdateGameLibraryEntryPatch = Partial<Omit<GameServerJson, '_id'>>;
