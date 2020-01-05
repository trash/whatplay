import * as moment from 'moment';
import { Request, Response } from 'express';
import { mysqlDateFormat } from '../constants';

import { AuthenticatedRequest } from './AuthenticatedRequest';

// const knex = client(knexfile);
const knex: any = {};

export function createNote(req: Request, res: Response) {
    console.warn('do validation on note here');
    const newNote = {
        note: req.body.note,
        date: req.body.date,
        user_id: req.body.userId,
        period: req.body.period
    };
    return knex('note')
        .insert(newNote)
        .then(([id]) => {
            return res.status(201).send(
                Object.assign(
                    {
                        id
                    },
                    newNote
                )
            );
        })
        .catch(error => {
            console.error(error.code, error.sqlMessage);
            return res.sendStatus(500);
        });
}

export function deleteNote(req: Request, res: Response) {
    return knex('note')
        .where('id', req.params.id)
        .delete()
        .then(() => {
            return res.sendStatus(200);
        });
}

export function updateNote(req: Request, res: Response) {
    console.warn('do validation on note here', req.body, req.body.note);
    return knex('note')
        .where('id', req.params.id)
        .update(req.body)
        .then(([id]) => {
            return res.sendStatus(200);
        });
}

function getNotes(req: AuthenticatedRequest) {
    return knex('note')
        .join('user', 'user.id', '=', 'note.user_id')
        .where('user.auth0_id', req.user.sub)
        .select('note.*');
}

export function getAllNotes(req: AuthenticatedRequest, res: Response) {
    const startDateString = req.params.startDate;
    let notesQuery = getNotes(req);
    if (startDateString && moment(startDateString).isValid()) {
        const startDate = moment(startDateString);
        notesQuery = notesQuery
            .where('date', '>=', startDate.format(mysqlDateFormat))
            .andWhere(
                'date',
                '<=',
                startDate.add(7, 'days').format(mysqlDateFormat)
            );
    }
    return notesQuery.then(data => res.status(200).send(data));
}
