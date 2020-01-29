import { createAction } from 'typesafe-actions';
import { Game } from 'client/src/models/game.model';

export const addGame = createAction('ADD_GAME', (game: Game) => game)<Game>();

export const deleteGame = createAction('DELETE_GAME', (id: string) => id)<
    string
>();

export const updateGame = createAction(
    'UPDATE_GAME',
    (id: string, game: Game) => ({
        id,
        game
    })
)<{ id: string; game: Game }>();

export const updateSearchResults = createAction(
    'UPDATE_SEARCH_RESULTS',
    (games: Game[], totalMatches: number, maxPage: number) => ({
        games,
        totalMatches,
        maxPage
    })
)<{
    games: Game[];
    totalMatches: number;
    maxPage: number;
}>();
