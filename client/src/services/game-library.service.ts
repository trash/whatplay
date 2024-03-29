import { Api } from './Api';
import {
    AddGamePost,
    UpdateGameLibraryEntryPatch,
    GameLibraryEntryReferenceServerJson,
    HydratedGameLibraryEntryServer
} from '@shared/models/user.model';
import { HydratedGameLibraryClient } from '../models/user.model';
import { Game } from '../models/game.model';
import { GameUtilities } from '../models/game.util';
import moment from 'moment';
import { store } from '../redux/store';
import { List } from 'immutable';
import {
    GameLibraryEntryClient,
    GameLibrarySearchResponse,
    GameLibrarySort,
    GameRating
} from '@shared/models/game-library-entry.model';
import {
    removeGameFromLibrary,
    addGameToLibrary,
    updateLibrarySearchResults,
    updateHydratedGameLibraryEntry
} from '../redux/game-library/index.actions';
import debounce from '../util/debounce';

export class GameLibraryService {
    hasGameInLibrary(game: Game): boolean {
        return store
            .getState()
            .gameLibrary.gameLibrary.some(entry => entry?.gameId === game.id);
    }

    toggleGameFromLibrary(game: Game) {
        const hasGameInLibrary = this.hasGameInLibrary(game);
        if (hasGameInLibrary) {
            return this.removeGameFromLibrary(game);
        }
        return this.addGameToLibrary(game);
    }

    private async removeGameFromLibrary(game: Game) {
        await Api.delete(`/api/v1/library/${game.id}`);
        store.dispatch(removeGameFromLibrary(game.id));
        return;
    }
    private async addGameToLibrary(
        game: Game,
        rating: GameRating = GameRating.NotRated
    ) {
        const server = await Api.post<
            AddGamePost,
            GameLibraryEntryReferenceServerJson
        >(`/api/v1/library`, {
            rating,
            gameId: game.id
        });
        store.dispatch(addGameToLibrary(server));
        return server;
    }

    private gameLibraryTransform(
        server: HydratedGameLibraryEntryServer[]
    ): HydratedGameLibraryClient {
        return List(
            server.map(entry => {
                const game = GameUtilities.transformGameServertoGame(
                    entry.game
                );
                const gameLibraryEntry = Object.assign(
                    {},
                    entry.gameLibraryEntry,
                    {
                        dateCompleted:
                            entry.gameLibraryEntry.dateCompleted !== null
                                ? moment(entry.gameLibraryEntry.dateCompleted)
                                : null
                    }
                );

                return {
                    game,
                    gameLibraryEntry
                };
            })
        );
    }

    async getAllLibraryGames(
        userId: string,
        searchText: string = '',
        page: number = 0
    ): Promise<HydratedGameLibraryClient> {
        const server = await Api.get<GameLibrarySearchResponse>(
            `/api/v1/library`,
            {
                userId,
                page,
                search: searchText,
                sort: GameLibrarySort.BacklogPriority
            }
        );
        console.log(server);
        const hydrated = this.gameLibraryTransform(server.results);
        store.dispatch(
            updateLibrarySearchResults(
                hydrated,
                server.totalCount,
                server.maxPage
            )
        );
        return hydrated;
    }

    debouncedGetAllLibraryGames = debounce(this.getAllLibraryGames, 250);

    async updateGameLibraryEntry(
        gameLibraryEntry: GameLibraryEntryClient,
        update: UpdateGameLibraryEntryPatch
    ): Promise<void> {
        await Api.patch<UpdateGameLibraryEntryPatch>(
            `/api/v1/library/${gameLibraryEntry._id}`,
            update
        );
        store.dispatch(
            updateHydratedGameLibraryEntry(gameLibraryEntry, update)
        );
        return;
    }

    async setRatingAndAddGameToLibrary(game: Game, rating: GameRating) {
        return this.addGameToLibrary(game, rating);
    }
}
export const gameLibraryService = new GameLibraryService();
