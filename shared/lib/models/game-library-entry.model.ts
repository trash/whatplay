import { Moment } from 'moment';
import { MongoDocument, MongoDocumentJson } from './mongoDocument';

export enum PlayedStatus {
    Playing,
    PlayedWantToComplete,
    NotPlayed,
    Completed,
    PlayedNotGoingToComplete
}

export enum BacklogPriority {
    None = 0,
    Low = 1,
    Medium = 2,
    High = 3
}

export enum GameRating {
    NotRated = 0,
    Disliked = 1,
    Liked = 2
}

export const gameRatingsArray = [
    {
        value: GameRating.NotRated,
        text: 'Not rated'
    },
    { value: GameRating.Disliked, text: '👎 Disiked' },
    {
        value: GameRating.Liked,
        text: '👍 Liked'
    }
];

interface GameLibraryEntryShared {
    gameId: string;
    rating: GameRating;
    playedStatus: PlayedStatus;
    comments: string;
    backlogPriority: BacklogPriority | null;
    systemsOwned: string[];
}

export interface GameLibraryEntryServer
    extends MongoDocument,
        GameLibraryEntryShared {
    dateCompleted: string | null;
}

export interface GameLibraryEntryServerJson
    extends MongoDocumentJson,
        GameLibraryEntryShared {
    dateCompleted: string | null;
}

export interface GameLibraryEntryClient
    extends GameLibraryEntryShared,
        MongoDocumentJson {
    dateCompleted: Moment | null;
}
