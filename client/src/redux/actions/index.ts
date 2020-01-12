import { Note } from '../../models/note';
import * as actionTypes from './types';
import { Game } from '../../models/game.model';

export interface AddGame {
    type: actionTypes.ADD_GAME;
    game: Game;
}

export function addGame(game: Game): AddGame {
    return {
        game,
        type: actionTypes.ADD_GAME
    };
}

export interface DeleteGame {
    type: actionTypes.DELETE_GAME;
    id: string;
}

export function deleteGame(id: string): DeleteGame {
    return {
        id,
        type: actionTypes.DELETE_GAME
    };
}

export interface UpdateGame {
    type: actionTypes.UPDATE_GAME;
    id: string;
    game: Game;
}

export function updateGame(id: string, game: Game): UpdateGame {
    return {
        id,
        game,
        type: actionTypes.UPDATE_GAME
    };
}

export interface UpdateNotes {
    type: actionTypes.UPDATE_NOTES;
    notes: Note[];
}

export function updateNotes(notes: Note[]): UpdateNotes {
    return {
        notes,
        type: actionTypes.UPDATE_NOTES
    };
}

export interface UpdateGames {
    type: actionTypes.UPDATE_GAMES;
    games: Game[];
}

export function updateGames(games: Game[]): UpdateGames {
    return {
        games,
        type: actionTypes.UPDATE_GAMES
    };
}

export interface Login {
    type: actionTypes.LOGIN;
}
export function login(): Login {
    return {
        type: actionTypes.LOGIN
    };
}

export interface Logout {
    type: actionTypes.LOGOUT;
}
export function logout(): Logout {
    return {
        type: actionTypes.LOGOUT
    };
}
