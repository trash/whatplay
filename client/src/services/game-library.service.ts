import { Api } from './Api';
import {
    GameLibraryEntryReferenceClient,
    AddGamePost,
    GameLibraryEntryReferenceServer,
    GetGameLibraryPostClient,
    GetGameLibraryPostServer,
    UpdateGameLibraryEntryPatch
} from '@shared/models/user.model';
import { HydratedGameLibraryClient } from '../models/user.model';
import { Game } from '../models/game.model';
import { GameUtilities } from '../models/game.util';
import moment from 'moment';
import { store } from '../redux/store';
import { List } from 'immutable';
import { GameLibraryEntryClient } from '@shared/models/game-library-entry.model';
import {
    removeGameFromLibrary,
    addGameToLibrary,
    updateHydratedGameLibrary,
    updateHydratedGameLibraryEntry
} from '../redux/game-library/index.actions';

class GameLibraryService {
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
    private async addGameToLibrary(game: Game) {
        const server = await Api.post<
            AddGamePost,
            GameLibraryEntryReferenceServer
        >(`/api/v1/library`, {
            gameId: game.id
        });
        store.dispatch(addGameToLibrary(server));
        return server;
    }

    private gameLibraryTransform(
        server: GetGameLibraryPostServer
    ): HydratedGameLibraryClient {
        return List(
            server.gameLibraryEntries.map(entry => {
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
        library: List<GameLibraryEntryReferenceClient>
    ): Promise<HydratedGameLibraryClient> {
        const server = await Api.post<
            GetGameLibraryPostClient,
            GetGameLibraryPostServer
        >(`/api/v1/library/getAll`, {
            gameLibrary: library.toArray()
        });
        const hydrated = this.gameLibraryTransform(server);
        store.dispatch(updateHydratedGameLibrary(hydrated));
        return hydrated;
    }

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
}
export const gameLibraryService = new GameLibraryService();
