import * as _ from 'lodash';
import { createStore } from 'redux';
import rootReducer from './root.reducer';
import { ActionType } from 'typesafe-actions';
import actions from './actions';

export type RootAction = ActionType<typeof actions>;

export const store = createStore(rootReducer);
