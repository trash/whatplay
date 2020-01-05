import { Note } from '../../models/note';
import * as actionTypes from './types';

export interface AddNote {
    type: actionTypes.ADD_NOTE;
    note: Note;
}

export function addNote(note: Note): AddNote {
    return {
        note,
        type: actionTypes.ADD_NOTE
    };
}

export interface DeleteNote {
    type: actionTypes.DELETE_NOTE;
    id: number;
}

export function deleteNote(id: number): DeleteNote {
    return {
        id,
        type: actionTypes.DELETE_NOTE
    };
}

export interface UpdateNote {
    type: actionTypes.UPDATE_NOTE;
    id: number;
    note: string;
}

export function updateNote(id: number, note: string): UpdateNote {
    return {
        id,
        note,
        type: actionTypes.UPDATE_NOTE
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
