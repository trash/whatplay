import { User } from 'client/src/services/ReactAuth';
import { createAction } from 'typesafe-actions';

export const updateUser = createAction('UPDATE_USER', (user: User) => user)<
    User
>();
