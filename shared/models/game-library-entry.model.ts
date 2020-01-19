enum PlayedStatus {
    Playing,
    PlayedWantToComplete,
    NotPlayed,
    Completed,
    PlayedNotGoingToComplete
}

enum BacklogPriority {
    None = 0,
    Low = 1,
    Medium = 2,
    High = 3
}

export interface GameLibraryEntryServer {
    gameId: string;
    rating: number | null;
    playedStatus: PlayedStatus | null;
    comments: string;
    dateCompleted: string | null;
    backlogPriority: BacklogPriority | null;
    systemsOwned: string[];
}
