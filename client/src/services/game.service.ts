import { Api } from './Api';

import { store } from '../redux/store';

import { Game } from '../models/game.model';
import { GameUtilities } from '../models/game.util';
import {
    GameStub,
    GamePatch,
    GameServerJson,
    GamePatchServer,
    GameSearchResponse,
    GameExactMatchServer
} from '@shared/models/game.model';
import moment from 'moment';
import {
    addGame,
    updateGame,
    deleteGame,
    updateSearchResults
} from '../redux/games/index.actions';
import debounce from '../util/debounce';

class GameService {
    private async internalSearchGames(
        searchText: string,
        page = 0
    ): Promise<Game[]> {
        const response = await Api.get<GameSearchResponse>(
            `/api/v1/games/search`,
            {
                page,
                search: searchText
            }
        );

        const matches = response.results.map(g =>
            GameUtilities.transformGameServertoGame(g, g.libraryCount)
        );
        store.dispatch(
            updateSearchResults(matches, response.totalCount, response.maxPage)
        );
        return matches;
    }

    private async internalCheckExactTitleMatch(
        title: string
    ): Promise<boolean> {
        const response = await Api.get<GameExactMatchServer>(
            `/api/v1/games/exactMatch`,
            {
                title
            }
        );

        console.log(response);

        return response;
    }

    checkExactTitleMatch = debounce(this.internalCheckExactTitleMatch, 250);
    searchGames = debounce(this.internalSearchGames, 250);

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

    async unarchiveGame(id: string): Promise<void> {
        await Api.patch(`/api/v1/games/${id}/unarchive`, {});
        store.dispatch(deleteGame(id));
    }
}
export const gameService = new GameService();
