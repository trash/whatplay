import { User } from 'client/src/models/user.model';
import { createAction } from 'typesafe-actions';

export const updateUser = createAction('UPDATE_USER', (user: User) => user)<
    User
>();
