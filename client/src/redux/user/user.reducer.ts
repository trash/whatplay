import { createReducer } from 'typesafe-actions';
import { updateUser } from './user.actions';
import { combineReducers } from 'redux';

export const isAdmin = createReducer(false).handleAction(
    updateUser,
    (_state, action) => action.payload.isAdmin
);

// Can delete when types fixed in lib
export type UserReducersType = {
    isAdmin: boolean;
};

export const userReducers = combineReducers<UserReducersType>({
    isAdmin
});
