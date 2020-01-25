import { List } from 'immutable';
import { Game } from 'client/src/models/game.model';
import { createReducer } from 'typesafe-actions';
import { combineReducers } from 'redux';
import { addGame, deleteGame, updateGame, updateGames } from './games.actions';

// Should be able to delete this when the types are properly fixed for inference
// on reducers
export type GamesReducersType = {
    searchResults: List<Game>;
};

export const searchResults = createReducer(List() as List<Game>)
    .handleAction(addGame, (state, action) => state.push(action.payload))
    .handleAction(deleteGame, (state, action) => {
        const id = action.payload;
        const index = state.findIndex(n => n!.id === id);
        return state.remove(index);
    })
    .handleAction(updateGame, (state, action) => {
        const index = state.findIndex(g => g!.id === action.payload.id);
        return state.update(index, n => {
            return Object.assign({}, n, action.payload.game);
        });
    })
    .handleAction(updateGames, (_state, action) => List(action.payload));

export const gamesReducers = combineReducers<GamesReducersType>({
    searchResults
});
