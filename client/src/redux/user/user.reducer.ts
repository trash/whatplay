import { createReducer } from 'typesafe-actions';
import {
    updateUser,
    addGameToLibrary,
    removeGameFromLibrary,
    updateHydratedGameLibrary
} from './user.actions';
import { combineReducers } from 'redux';
import { List } from 'immutable';
import { GameLibraryEntryReferenceClient } from '@shared/models/user.model';
import { HydratedGameLibraryClient } from '../../models/user.model';

export const isAdmin = createReducer(false).handleAction(
    updateUser,
    (_state, action) => {
        return action.payload.isAdmin;
    }
);

export const hydratedGameLibrary = createReducer<HydratedGameLibraryClient | null>(
    null
).handleAction(updateHydratedGameLibrary, (_state, action) => action.payload);

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
export type UserReducersType = {
    isAdmin: boolean;
    gameLibrary: List<GameLibraryEntryReferenceClient>;
    hydratedGameLibrary: HydratedGameLibraryClient;
};

export const userReducers = combineReducers<UserReducersType>({
    isAdmin,
    gameLibrary,
    hydratedGameLibrary
});
