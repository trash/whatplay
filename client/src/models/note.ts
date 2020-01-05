import { Moment } from 'moment';
import { DatePeriod } from './enums';

export type NotePatchServer = {
    note?: string;
    date?: string;
    period?: DatePeriod;
};

export type NotePostServer = {
    date: string;
    note: string;
    period: DatePeriod;
    userId: number;
};

export type NoteServer = {
    date: string;
    id: number;
    note: string;
    period: DatePeriod;
    user_id: number;
};

export type Note = {
    date: Moment;
    id: number;
    note: string;
    period: DatePeriod;
    userId: number;
};
