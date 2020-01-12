import * as _ from 'lodash';
import * as Immutable from 'immutable';
import { createStore } from 'redux';

import * as actionTypes from './actions/types';
import {
    AddGame,
    DeleteGame,
    UpdateGame,
    UpdateNotes,
    Login,
    Logout,
    UpdateGames
} from './actions';

import { Note } from '../models/note';
import { Game } from '../models/game.model';

type ReducerAction =
    | AddGame
    | DeleteGame
    | UpdateGame
    | UpdateNotes
    | UpdateGames
    | Login
    | Logout;

export interface StoreState {
    notes: Immutable.List<Note>;
    games: Immutable.List<Game>;
    isAuthenticated: boolean;
}

const initialState: StoreState = {
    notes: Immutable.List(),
    games: Immutable.List(),
    isAuthenticated: false
};

function mainReducer(previousState = initialState, action: ReducerAction) {
    const newState = _.extend({}, previousState);

    switch (action.type) {
        case actionTypes.ADD_GAME:
            newState.games = previousState.games.push(action.game);
            break;

        case actionTypes.DELETE_GAME: {
            const index = previousState.games.findIndex(
                n => n!.id === action.id
            );
            newState.games = previousState.games.remove(index);
            break;
        }
        case actionTypes.UPDATE_GAME: {
            const index = previousState.games.findIndex(
                g => g!.id === action.id
            );
            newState.games = previousState.games.update(index, n => {
                return Object.assign({}, n, action.game);
            });
            break;
        }
        case actionTypes.UPDATE_NOTES:
            newState.notes = Immutable.List(action.notes);
            break;

        case actionTypes.UPDATE_GAMES:
            newState.games = Immutable.List(action.games);
            break;

        case actionTypes.LOGIN:
            newState.isAuthenticated = true;
            break;
        case actionTypes.LOGOUT:
            newState.isAuthenticated = false;
            break;
    }

    return newState;
}

export const store = createStore<StoreState>(mainReducer);
