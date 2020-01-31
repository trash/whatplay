import { MongoDocument, MongoDocumentJson } from './mongoDocument';
import { Permission } from './permission.model';
import { GameServerJson } from './game.model';
import { GameLibraryEntryServerJson } from './game-library-entry.model';
import { ObjectId } from 'mongodb';

export type GameLibraryEntryReferenceServer = {
    gameId: ObjectId;
    gameLibraryEntryId: ObjectId;
};
export type GameLibraryEntryReferenceServerJson = {
    gameId: string;
    gameLibraryEntryId: string;
};
export type GameLibraryEntryReferenceClient = {
    gameId: string;
    gameLibraryEntryId: string;
};

export interface UserServerShared {
    auth0Id: string;
}

export interface UserServer extends MongoDocument, UserServerShared {
    gameLibrary: GameLibraryEntryReferenceServer[];
}
export interface UserServerJson extends MongoDocumentJson, UserServerShared {
    permissions: Permission[];
    gameLibrary: GameLibraryEntryReferenceServerJson[];
}

export type AddGamePost = {
    gameId: string;
};

export type HydratedGameLibraryEntryServer = {
    game: GameServerJson;
    gameLibraryEntry: GameLibraryEntryServerJson;
};

export type GetGameLibraryPostServer = {
    gameLibraryEntries: HydratedGameLibraryEntryServer[];
};

export type UpdateGameLibraryEntryPatch = Partial<Omit<GameServerJson, '_id'>>;
