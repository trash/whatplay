import moment from 'moment';

import { Api } from './Api';

import { DatePeriod } from '../models/enums';
import {
    NoteServer,
    Note,
    NotePostServer,
    NotePatchServer
} from '../models/note';

import {
    addNote,
    deleteNote,
    updateNotes,
    updateNote,
    updateGames
} from '../redux/actions';
import { store } from '../redux/store';

import { mysqlDateFormat } from '../constants';
import { Game } from '../models/game';
import { GameServer } from '@shared/models/game';

class NoteService {
    private transformNoteServerToNote(noteServer: NoteServer): Note {
        return {
            userId: noteServer.user_id,
            note: noteServer.note,
            date: moment(noteServer.date),
            period: noteServer.period,
            id: noteServer.id
        };
    }

    private transformGameServertoGame(gameServer: GameServer): Game {
        return {
            id: gameServer._id,
            title: gameServer.title,
            genres: gameServer.genres,
            systems: gameServer.systems,
            timeToBeat: gameServer.timeToBeat
        };
    }

    private async getAllNotes(
        _userId: number,
        startDate?: string
    ): Promise<Note[]> {
        const queryParams = startDate
            ? {
                  startDate
              }
            : null;
        const notesServer = await Api.get<NoteServer[]>(
            `/api/v1/notes`,
            queryParams
        );
        return notesServer.map(n => this.transformNoteServerToNote(n));
    }

    private async getAllGames(): Promise<Game[]> {
        const gamesServer = await Api.get<GameServer[]>(`/api/v1/notes`);
        return gamesServer.map(g => this.transformGameServertoGame(g));
    }

    async refetchAllNotes(userId: number): Promise<Note[]> {
        let notes = await this.getAllNotes(userId);
        store.dispatch(updateNotes(notes));
        return notes;
    }

    async refetchAllGames(): Promise<Game[]> {
        let games = await this.getAllGames();
        store.dispatch(updateGames(games));
        return games;
    }

    async createNote(
        userId: number,
        note: string,
        datePeriod: DatePeriod
    ): Promise<Note> {
        const newNote = await Api.post<NotePostServer, NoteServer>(
            '/api/v1/notes',
            {
                userId: userId,
                note: note,
                date: moment()
                    .utc()
                    .format(mysqlDateFormat),
                period: datePeriod
            }
        ).then(noteServer => this.transformNoteServerToNote(noteServer));

        store.dispatch(addNote(newNote));

        return newNote;
    }

    async deleteNote(id: number): Promise<void> {
        await Api.delete(`/api/v1/notes/${id}`);
        store.dispatch(deleteNote(id));
    }

    async updateNote(id: number, note: string): Promise<Note> {
        await Api.patch<NotePatchServer, null>(`/api/v1/notes/${id}`, {
            note
        });
        store.dispatch(updateNote(id, note));
        return store.getState().notes.find(n => n!.id === id);
    }

    async getNotesForWeek(
        userId: number,
        inputDayInWeek: moment.Moment = moment()
    ): Promise<Note[]> {
        const dayInWeek = inputDayInWeek.utc();
        const sunday = dayInWeek.day('Sunday').startOf('day');
        const allNotes = await this.getAllNotes(userId, sunday.format());
        return allNotes;
    }
}

export const noteService = new NoteService();
