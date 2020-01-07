import * as _ from 'lodash';
import * as Immutable from 'immutable';
import { createStore } from 'redux';

import * as actionTypes from './actions/types';
import {
    AddNote,
    DeleteNote,
    UpdateNote,
    UpdateNotes,
    Login,
    Logout
} from './actions';

import { Note } from '../models/note';

type ReducerAction =
    | AddNote
    | DeleteNote
    | UpdateNote
    | UpdateNotes
    | Login
    | Logout;

export interface StoreState {
    notes: Immutable.List<Note>;
    isAuthenticated: boolean;
}

const initialState: StoreState = {
    notes: Immutable.List(),
    isAuthenticated: false
};

function mainReducer(previousState = initialState, action: ReducerAction) {
    const newState = _.extend({}, previousState);

    switch (action.type) {
        case actionTypes.ADD_NOTE:
            newState.notes = previousState.notes.push(action.note);
            break;
        case actionTypes.DELETE_NOTE: {
            const index = previousState.notes.findIndex(
                n => n!.id === action.id
            );
            newState.notes = previousState.notes.remove(index);
            break;
        }
        case actionTypes.UPDATE_NOTE: {
            const index = previousState.notes.findIndex(
                n => n!.id === action.id
            );
            newState.notes = previousState.notes.update(index, n => {
                return Object.assign({}, n, {
                    note: action.note
                });
            });
            break;
        }
        case actionTypes.UPDATE_NOTES:
            newState.notes = Immutable.List(action.notes);
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
