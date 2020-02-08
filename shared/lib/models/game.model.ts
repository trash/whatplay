import { MongoDocument, MongoDocumentJson } from './mongoDocument';
import { PaginatedResponse } from './paginated.model';

// The data the client send to the server for a PATCH
export type GamePatch = {
    game: Partial<GameStub>;
};

// The data the server returns after a successful PATCH
export type GamePatchServer = {
    update: {
        lastModifiedTime: string;
    };
};

export type GamePostServer = {};

export interface GameStub {
    title: string;
    systems: string[];
    genres: string[];
    timeToBeat: number;
    isModerated: boolean;
}

export interface GameNotSavedServer extends GameStub {
    lastModifiedTime: string;
    createdTime: string;
    createdByAuth0Id: string;
}

export interface GameServer extends MongoDocument, GameNotSavedServer {}
interface _GameServerJson extends MongoDocumentJson, GameNotSavedServer {}
// Do NOT send "createdByAuth0Id" to the client.
export type GameServerJson = Omit<_GameServerJson, 'createdByAuth0Id'>;
export interface GameServerJsonWithLibraryCount extends GameServerJson {
    libraryCount: number;
}

export type GameSearchResponse = PaginatedResponse<
    GameServerJsonWithLibraryCount
>;

export type GameExactMatchServer = boolean;
