import { Moment } from 'moment';
import { MongoDocument, MongoDocumentJson } from './mongoDocument';
import { ObjectId } from 'mongodb';
import { GameServer } from './game.model';
import { HydratedGameLibraryEntryServer } from './user.model';
import { PaginatedResponse } from './paginated.model';

// Ordered from lowest priority to highest priority in terms of what
// people likely want to play next/finish first
export enum PlayedStatus {
    PlayedNotGoingToComplete,
    Completed,
    NotPlayed,
    PlayedWantToComplete,
    Playing
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

export enum GameLibrarySort {
    GameTitle,
    BacklogPriority,
    Rating,
    PlayedStatus,
    TimeToBeat
}

export const gameLibrarySortMap: Map<
    GameLibrarySort,
    {
        sortKey: string;
        defaultSort: 1 | -1;
    }
> = new Map([
    [
        GameLibrarySort.GameTitle,
        {
            sortKey: 'game.title',
            defaultSort: 1
        }
    ],
    [
        GameLibrarySort.BacklogPriority,
        {
            sortKey: 'backlogPriority',
            defaultSort: -1
        }
    ],
    [
        GameLibrarySort.Rating,
        {
            sortKey: 'rating',
            defaultSort: 1
        }
    ],
    [
        GameLibrarySort.PlayedStatus,
        {
            sortKey: 'playedStatus',
            defaultSort: 1
        }
    ],
    [
        GameLibrarySort.TimeToBeat,
        {
            sortKey: 'game.timeToBeat',
            defaultSort: 1
        }
    ]
]);

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

export const backlogPriorityArray = [
    {
        value: BacklogPriority.None,
        text: 'Not set'
    },
    {
        value: BacklogPriority.Low,
        text: 'Low'
    },
    {
        value: BacklogPriority.Medium,
        text: 'Medium'
    },
    {
        value: BacklogPriority.High,
        text: 'High'
    }
];

export const playedStatusArray = [
    {
        value: PlayedStatus.PlayedNotGoingToComplete,
        text: 'Played. Not going to complete.'
    },
    {
        value: PlayedStatus.Completed,
        text: 'Completed.'
    },
    {
        value: PlayedStatus.NotPlayed,
        text: 'Not played.'
    },
    {
        value: PlayedStatus.PlayedWantToComplete,
        text: 'Played at some point. Want to complete.'
    },
    {
        value: PlayedStatus.Playing,
        text: 'Current playing'
    }
];

interface GameLibraryEntryShared {
    // gameId: string;
    rating: GameRating;
    playedStatus: PlayedStatus;
    comments: string;
    backlogPriority: BacklogPriority | null;
    systemsOwned: string[];
    userAuth0Id: string;
}

export interface GameLibraryEntryServer
    extends MongoDocument,
        GameLibraryEntryShared {
    dateCompleted: string | null;
    gameId: ObjectId;
}

export interface GameLibraryEntryServerWithGame extends GameLibraryEntryServer {
    game: [GameServer];
}

export interface GameLibraryEntryServerJson
    extends MongoDocumentJson,
        GameLibraryEntryShared {
    dateCompleted: string | null;
    gameId: string;
}

export interface GameLibraryEntryClient
    extends GameLibraryEntryShared,
        MongoDocumentJson {
    dateCompleted: Moment | null;
    gameId: string;
}

export type GameLibrarySearchResponse = PaginatedResponse<
    HydratedGameLibraryEntryServer
>;
