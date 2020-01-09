import { Api } from './Api';

import { updateGames } from '../redux/actions';
import { store } from '../redux/store';

import { Game } from '../models/game';
import { GameServer } from '@shared/models/game';

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

    // async createNote(
    //     userId: number,
    //     note: string,
    //     datePeriod: DatePeriod
    // ): Promise<Note> {
    //     const newNote = await Api.post<NotePostServer, NoteServer>(
    //         '/api/v1/notes',
    //         {
    //             userId: userId,
    //             note: note,
    //             date: moment()
    //                 .utc()
    //                 .format(mysqlDateFormat),
    //             period: datePeriod
    //         }
    //     ).then(noteServer => this.transformNoteServerToNote(noteServer));

    //     store.dispatch(addNote(newNote));

    //     return newNote;
    // }

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
