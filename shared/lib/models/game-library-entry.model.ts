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

interface GameLibraryEntryShared {
    gameId: string;
    rating: number | null;
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
