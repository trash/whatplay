import { createReducer } from 'typesafe-actions';
import { combineReducers } from 'redux';

export const placeholder = createReducer(false);
// Can delete when types fixed in lib
export type UserReducersType = {
    placeholder: boolean;
};

export const userReducers = combineReducers<UserReducersType>({
    placeholder
});
