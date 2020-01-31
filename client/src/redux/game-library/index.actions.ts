import { HydratedGameLibraryClient } from 'client/src/models/user.model';
import { createAction } from 'typesafe-actions';
import {
    GameLibraryEntryReferenceClient,
    UpdateGameLibraryEntryPatch
} from '@shared/models/user.model';
import { GameLibraryEntryClient } from '@shared/models/game-library-entry.model';

export const addGameToLibrary = createAction(
    'ADD_GAME_TO_LIBRARY',
    (gameLibraryEntry: GameLibraryEntryReferenceClient) => gameLibraryEntry
)<GameLibraryEntryReferenceClient>();

export const removeGameFromLibrary = createAction(
    'REMOVE_GAME_FROM_LIBRARY',
    (gameId: string) => gameId
)<string>();

export const updateLibrarySearchResults = createAction(
    'UPDATE_HYDRATED_GAME_LIBRARY',
    (
        results: HydratedGameLibraryClient,
        totalMatches: number,
        maxPage: number
    ) => ({
        results,
        totalMatches,
        maxPage
    })
)<{
    results: HydratedGameLibraryClient;
    totalMatches: number;
    maxPage: number;
}>();

export const updateHydratedGameLibraryEntry = createAction(
    'UPDATE_HYDRATED_GAME_LIBRARY_ENTRY',
    (
        gameLibraryEntry: GameLibraryEntryClient,
        update: UpdateGameLibraryEntryPatch
    ) => ({
        gameLibraryEntry,
        update
    })
)<{
    gameLibraryEntry: GameLibraryEntryClient;
    update: UpdateGameLibraryEntryPatch;
}>();
