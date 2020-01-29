import { combineReducers } from 'redux';
import { gamesReducers, GamesReducersType } from './games/index.reducer';
import { userReducers, UserReducersType } from './user/index.reducer';
import {
    GameLibraryReducersType,
    gameLibraryReducers
} from './game-library/index.reducer';

const rootReducer = combineReducers<{
    games: GamesReducersType;
    user: UserReducersType;
    gameLibrary: GameLibraryReducersType;
}>({
    games: gamesReducers,
    user: userReducers,
    gameLibrary: gameLibraryReducers
});

export default rootReducer;
