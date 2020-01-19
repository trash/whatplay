import { Api } from './Api';

import { store } from '../redux/store';

import { Game, GameUtilities } from '../models/game.model';
import {
    GameStub,
    GamePatch,
    GameServerJson,
    GamePatchServer
} from '@shared/models/game.model';
import moment from 'moment';
import {
    updateGames,
    addGame,
    updateGame,
    deleteGame
} from '../redux/games/games.actions';

class GameService {
    private async getAllGames(): Promise<Game[]> {
        const gamesServer = await Api.get<GameServerJson[]>(`/api/v1/games`);
        return gamesServer.map(g => GameUtilities.transformGameServertoGame(g));
    }

    async refetchAllGames(): Promise<Game[]> {
        let games = await this.getAllGames();
        store.dispatch(updateGames(games));
        return games;
    }

    async createGame(game: GameStub): Promise<Game> {
        const newGame = await Api.post<GameStub, GameServerJson>(
            '/api/v1/games',
            game
        ).then(gameServer =>
            GameUtilities.transformGameServertoGame(gameServer)
        );

        store.dispatch(addGame(newGame));

        return newGame;
    }

    async updateGame(game: Game): Promise<Game> {
        try {
            const gameUpdate = await Api.patch<GamePatch, GamePatchServer>(
                `/api/v1/games/${game.id}`,
                {
                    game
                }
            );
            game.lastModifiedTime = moment(gameUpdate.update.lastModifiedTime);
        } catch (e) {
            console.error('error-notification');
            throw e;
        }

        store.dispatch(updateGame(game.id, game));

        return game;
    }

    async deleteGame(id: string): Promise<void> {
        await Api.delete(`/api/v1/games/${id}`);
        store.dispatch(deleteGame(id));
    }

    // async updateNote(id: number, note: string): Promise<Note> {
    //     await Api.patch<NotePatchServer, null>(`/api/v1/notes/${id}`, {
    //         note
    //     });
    //     store.dispatch(updateNote(id, note));
    //     return store.getState().notes.find(n => n!.id === id);
    // }
}
export const gameService = new GameService();
