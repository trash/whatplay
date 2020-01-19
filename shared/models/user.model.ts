import { MongoDocument, MongoDocumentJson } from './mongoDocument';
import { Permission } from './permission.model';

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
    isAdmin: boolean;
    gameLibrary: GameLibraryEntryReferenceServer[];
}

export interface UserServer extends MongoDocument, UserNotSavedServer {}
export interface UserServerJson extends MongoDocumentJson, UserNotSavedServer {
    permissions: Permission[];
}

export type AddGamePost = {
    gameId: string;
};
