import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { GameServer, GameStub } from '@shared/models/game.model';

type ControllerMethod = (req: Request, res: Response) => Promise<Response>;

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

export const createGame: ControllerMethod = async (req, res) => {
    console.warn('do validation on note here');
    const newGame = {
        title: req.body.title,
        systems: req.body.systems,
        genres: req.body.genres,
        timeToBeat: req.body.timeToBeat
    };

    console.log(
        'need to pull this logic of setting a connection to db up out of here.'
    );
    const client = new MongoClient(process.env.DATABASE_URL!);
    try {
        await client.connect();

        const db = client.db(process.env.DATABASE_NAME);

        const collection = db.collection<GameStub>('games');

        const gameWithId = await collection.insertOne(newGame);

        return res.status(200).send(gameWithId.ops[0]);
    } catch (e) {
        return res.status(500).send(e);
    }
    client.close();
};
export const deleteGame: ControllerMethod = async (_req, res) => {
    return res.status(501).send();
};
export const updateGame: ControllerMethod = async (_req, res) => {
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
        // console.log(matches);

        return res.status(200).send(matches);
    } catch (e) {
        return res.status(500).send(e);
    }
    client.close();
}
