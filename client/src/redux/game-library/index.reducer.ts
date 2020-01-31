import { createReducer } from 'typesafe-actions';
import {
    addGameToLibrary,
    removeGameFromLibrary,
    updateLibrarySearchResults,
    updateHydratedGameLibraryEntry
} from './index.actions';
import { combineReducers } from 'redux';
import { List } from 'immutable';
import { GameLibraryEntryReferenceClient } from '@shared/models/user.model';
import { HydratedGameLibraryClient } from '../../models/user.model';
import { updateUser } from '../user/index.actions';
import { cloneDeep } from 'lodash';

export const searchResults = createReducer<HydratedGameLibraryClient | null>(
    null
)
    .handleAction(
        updateLibrarySearchResults,
        (_state, action) => action.payload.results
    )
    .handleAction(updateHydratedGameLibraryEntry, (state, action) => {
        if (!state) {
            return null;
        }
        // Find the place to update
        const indexToUpdate = state.findIndex(
            e => e?.gameLibraryEntry._id === action.payload.gameLibraryEntry._id
        );
        // Apply the update to the game library entry
        const updatedGameLibraryEntry = Object.assign(
            {},
            action.payload.gameLibraryEntry,
            action.payload.update
        );
        // Clone and copy over the game library entry update to hydrated entry
        const clonedEntry = cloneDeep(state.get(indexToUpdate));
        clonedEntry.gameLibraryEntry = updatedGameLibraryEntry;
        // Update the list
        return state.set(indexToUpdate, clonedEntry);
    });

export const searchResultsMaxPage = createReducer(0).handleAction(
    updateLibrarySearchResults,
    (_state, action) => action.payload.maxPage
);

export const searchResultsTotalMatches = createReducer(0).handleAction(
    updateLibrarySearchResults,
    (_state, action) => action.payload.totalMatches
);

export const gameLibrary = createReducer(
    List<GameLibraryEntryReferenceClient>()
)
    .handleAction(updateUser, (_state, action) => action.payload.gameLibrary)
    .handleAction(addGameToLibrary, (state, action) =>
        state.push(action.payload)
    )
    .handleAction(removeGameFromLibrary, (state, action) =>
        state.filter(e => e?.gameId !== action.payload).toList()
    );

// Can delete when types fixed in lib
export type GameLibraryReducersType = {
    gameLibrary: List<GameLibraryEntryReferenceClient>;
    searchResults: HydratedGameLibraryClient;
    searchResultsMaxPage: number;
    searchResultsTotalMatches: number;
};

export const gameLibraryReducers = combineReducers<GameLibraryReducersType>({
    gameLibrary,
    searchResults,
    searchResultsMaxPage,
    searchResultsTotalMatches
});
