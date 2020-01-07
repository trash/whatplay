import moment from 'moment';

import { Api } from './Api';

import { DatePeriod } from '../models/enums';
import {
    NoteServer,
    Note,
    NotePostServer,
    NotePatchServer
} from '../models/note';

import { addNote, deleteNote, updateNotes, updateNote } from '../redux/actions';
import { store } from '../redux/store';

import { mysqlDateFormat } from '../constants';

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

    async refetchAllNotes(userId: number): Promise<Note[]> {
        let notes = await this.getAllNotes(userId);
        store.dispatch(updateNotes(notes));
        return notes;
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
