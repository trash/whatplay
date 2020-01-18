import { combineReducers } from 'redux';
import { gamesReducers, GamesReducersType } from './games/games.reducer';
import { userReducers, UserReducersType } from './user/user.reducer';

const rootReducer = combineReducers<{
    games: GamesReducersType;
    user: UserReducersType;
}>({
    games: gamesReducers,
    user: userReducers
});

export default rootReducer;
