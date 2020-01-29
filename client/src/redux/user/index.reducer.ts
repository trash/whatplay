import { createReducer } from 'typesafe-actions';
import { updateUser } from './index.actions';
import { combineReducers } from 'redux';

export const isAdmin = createReducer(false).handleAction(
    updateUser,
    (_state, action) => {
        return action.payload.isAdmin;
    }
);

// Can delete when types fixed in lib
export type UserReducersType = {
    isAdmin: boolean;
};

export const userReducers = combineReducers<UserReducersType>({
    isAdmin
});
