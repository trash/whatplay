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
    DidNotLike = 1,
    ItWasOkay = 2,
    LikedIt = 3,
    ReallyLikedIt = 4,
    ItWasAmazing = 5
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

export const ratingHumanReadableMap: Map<GameRating, string> = new Map([
    [GameRating.NotRated, 'Not rated'],
    [GameRating.DidNotLike, '1: Did not like it'],
    [GameRating.ItWasOkay, '2: It was okay'],
    [GameRating.LikedIt, '3: Liked it'],
    [GameRating.ReallyLikedIt, '4: Really liked it'],
    [GameRating.ItWasAmazing, '5: It was amazing']
]);

export const ratingArray = [
    GameRating.NotRated,
    GameRating.DidNotLike,
    GameRating.ItWasOkay,
    GameRating.LikedIt,
    GameRating.ReallyLikedIt,
    GameRating.ItWasAmazing
].map(value => ({
    value,
    text: ratingHumanReadableMap.get(value)
}));

export const backlogPriorityHumanReadableMap: Map<
    BacklogPriority,
    string
> = new Map([
    [BacklogPriority.None, 'Not set'],
    [BacklogPriority.Low, 'Low'],
    [BacklogPriority.Medium, 'Medium'],
    [BacklogPriority.High, 'High']
]);

export const backlogPriorityArray = [
    BacklogPriority.None,
    BacklogPriority.Low,
    BacklogPriority.Medium,
    BacklogPriority.High
].map(value => ({
    value,
    text: backlogPriorityHumanReadableMap.get(value)
}));

export const playedStatusHumanReadableMap: Map<PlayedStatus, string> = new Map([
    [PlayedStatus.PlayedNotGoingToComplete, 'Played. Not going to complete.'],
    [PlayedStatus.Completed, 'Completed.'],
    [PlayedStatus.NotPlayed, 'Not played.'],
    [
        PlayedStatus.PlayedWantToComplete,
        'Played at some point. Want to complete.'
    ],
    [PlayedStatus.Playing, 'Currently playing.']
]);

export const playedStatusArray = [
    PlayedStatus.PlayedNotGoingToComplete,
    PlayedStatus.Completed,
    PlayedStatus.NotPlayed,
    PlayedStatus.PlayedWantToComplete,
    PlayedStatus.Playing
].map(value => ({
    value,
    text: playedStatusHumanReadableMap.get(value)
}));

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
