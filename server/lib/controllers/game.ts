import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { GameServer } from '@shared/models/game';

type ControllerMethod = (req: Request, res: Response) => Response;

// export function createNote(req: Request, res: Response) {
//     console.warn('do validation on note here');
//     const newNote = {
//         note: req.body.note,
//         date: req.body.date,
//         user_id: req.body.userId,
//         period: req.body.period
//     };
//     return knex('note')
//         .insert(newNote)
//         .then(([id]: [any]) => {
//             return res.status(201).send(
//                 Object.assign(
//                     {
//                         id
//                     },
//                     newNote
//                 )
//             );
//         })
//         .catch((error: any) => {
//             console.error(error.code, error.sqlMessage);
//             return res.sendStatus(500);
//         });
// }

export const createGame: ControllerMethod = (_req, res) => {
    return res.status(501).send();
};
export const deleteGame: ControllerMethod = (_req, res) => {
    return res.status(501).send();
};
export const updateGame: ControllerMethod = (_req, res) => {
    return res.status(501).send();
};

// export function deleteNote(req: Request, res: Response) {
//     return knex('note')
//         .where('id', req.params.id)
//         .delete()
//         .then(() => {
//             return res.sendStatus(200);
//         });
// }

// export function updateNote(req: Request, res: Response) {
//     console.warn('do validation on note here', req.body, req.body.note);
//     return knex('note')
//         .where('id', req.params.id)
//         .update(req.body)
//         .then(() => {
//             return res.sendStatus(200);
//         });
// }

export async function getAllGames(_req: Request, res: Response) {
    const client = new MongoClient(process.env.DATABASE_URL!);
    try {
        await client.connect();

        const db = client.db(process.env.DATABASE_NAME);

        const collection = db.collection<GameServer>('games');

        const matches = await collection.find({}).toArray();
        console.log(matches);

        return res.status(200).send(matches);
    } catch (e) {
        return res.status(500).send(e);
    }
    client.close();
}
