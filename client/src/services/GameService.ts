import { Api } from './Api';

import { updateGames, addGame, updateGame } from '../redux/actions';
import { store } from '../redux/store';

import { Game } from '../models/game.model';
import {
    GameServer,
    GameStub,
    GamePatchServer
} from '@shared/models/game.model';

class GameService {
    private transformGameServertoGame(gameServer: GameServer): Game {
        return {
            id: gameServer._id,
            title: gameServer.title,
            genres: gameServer.genres,
            systems: gameServer.systems,
            timeToBeat: gameServer.timeToBeat
        };
    }

    private async getAllGames(): Promise<Game[]> {
        const gamesServer = await Api.get<GameServer[]>(`/api/v1/games`);
        return gamesServer.map(g => this.transformGameServertoGame(g));
    }

    async refetchAllGames(): Promise<Game[]> {
        let games = await this.getAllGames();
        store.dispatch(updateGames(games));
        return games;
    }

    async createGame(game: GameStub): Promise<Game> {
        const newGame = await Api.post<GameStub, GameServer>(
            '/api/v1/games',
            game
        ).then(gameServer => this.transformGameServertoGame(gameServer));

        store.dispatch(addGame(newGame));

        return newGame;
    }

    async updateGame(game: Game): Promise<Game> {
        try {
            await Api.patch<GamePatchServer, null>(`/api/v1/games/${game.id}`, {
                game
            });
        } catch (e) {
            console.error('error-notification');
            throw e;
        }

        console.error(
            'we need to update the store with the updated game.'
                + ' possibly pass in an index and the updated game'
        );
        store.dispatch(updateGame(game.id, game));

        return game;
    }

    // async deleteNote(id: number): Promise<void> {
    //     await Api.delete(`/api/v1/notes/${id}`);
    //     store.dispatch(deleteNote(id));
    // }

    // async updateNote(id: number, note: string): Promise<Note> {
    //     await Api.patch<NotePatchServer, null>(`/api/v1/notes/${id}`, {
    //         note
    //     });
    //     store.dispatch(updateNote(id, note));
    //     return store.getState().notes.find(n => n!.id === id);
    // }
}
export const gameService = new GameService();
