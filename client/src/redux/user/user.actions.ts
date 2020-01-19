import { User } from 'client/src/models/user.model';
import { createAction } from 'typesafe-actions';
import { GameLibraryEntryReferenceClient } from '@shared/models/user.model';

export const updateUser = createAction('UPDATE_USER', (user: User) => user)<
    User
>();

export const addGameToLibrary = createAction(
    'ADD_GAME_TO_LIBRARY',
    (gameLibraryEntry: GameLibraryEntryReferenceClient) => gameLibraryEntry
)<GameLibraryEntryReferenceClient>();

export const removeGameFromLibrary = createAction(
    'REMOVE_GAME_FROM_LIBRARY',
    (gameId: string) => gameId
)<string>();
