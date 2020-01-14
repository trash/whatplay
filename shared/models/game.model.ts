import { MongoDocument, MongoDocumentJson } from './mongoDocument';

export type GamePatchServer = {
    game: Partial<GameStub>;
};

export type GamePostServer = {};

export interface GameStub {
    title: string;
    systems: string[];
    genres: string[];
    timeToBeat: number;
}

export interface GameNotSavedServer extends GameStub {
    lastModifiedTime: string;
    createdTime: string;
}

export interface GameServer extends MongoDocument, GameNotSavedServer {}
export interface GameServerJson extends MongoDocumentJson, GameNotSavedServer {}
