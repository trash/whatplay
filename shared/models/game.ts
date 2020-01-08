import { MongoDocument } from './mongoDocument';

export type GamePatchServer = {};

export type GamePostServer = {};

export interface GameServer extends MongoDocument {
    title: string;
    systems: string[];
    genres: string[];
    timeToBeat: number;
}

export type Game = {
    id: string;
    title: string;
    systems: string[];
    genres: string[];
    timeToBeat: number;
};
