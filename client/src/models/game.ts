export type GamePatchServer = {};

export type GamePostServer = {};

export type Game = {
    id: string;
    title: string;
    systems: string[];
    genres: string[];
    timeToBeat: number;
};
