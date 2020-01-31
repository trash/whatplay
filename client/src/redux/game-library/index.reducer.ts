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

export const searchResults = createReducer<HydratedGameLibraryClient | null>(
    null
)
    .handleAction(
        updateLibrarySearchResults,
        (_state, action) => action.payload.results
    )
    .handleAction(updateHydratedGameLibraryEntry, (state, action) => {
        // This is kind of a mess. I'm beginning to wonder if Immutable is
        // actually just a huge PITA
        if (!state) {
            return null;
        }
        const grouped = state.groupBy(
            e => e?.gameLibraryEntry._id === action.payload.gameLibraryEntry._id
        );
        const filtered = grouped.get(false)?.toList();
        const removed = grouped.get(true).get(0);
        removed.gameLibraryEntry = Object.assign(
            {},
            action.payload.gameLibraryEntry,
            action.payload.update
        );
        if (!filtered) {
            return List([removed]);
        }
        return filtered.push(removed);
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
