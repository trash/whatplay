import { MongoDocument } from './mongoDocument';

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

export interface GameServer extends MongoDocument, GameStub {}

// type KeysOf = keyof GameServer;

export type Game = {
    id: string;
    title: string;
    systems: string[];
    genres: string[];
    timeToBeat: number;
};
