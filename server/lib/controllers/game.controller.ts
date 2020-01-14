import { Request, Response } from 'express';
import { MongoClient, Db, ObjectId } from 'mongodb';
import {
    GameServer,
    GamePatchServer,
    GameNotSavedServer
} from '@shared/models/game.model';
import { getCurrentUtcTime } from '../helpers.util';

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

async function connectToDatabase(): Promise<[MongoClient, Db]> {
    const client = new MongoClient(process.env.DATABASE_URL!);
    try {
        await client.connect();

        const db = client.db(process.env.DATABASE_NAME);
        return [client, db];
    } catch (e) {
        console.error('Error connecting to DB');
        throw e;
    }
}

export const createGame: ControllerMethod = async (req, res) => {
    console.warn('do validation on note here');
    const newGame: GameNotSavedServer = {
        title: req.body.title,
        systems: req.body.systems,
        genres: req.body.genres,
        timeToBeat: req.body.timeToBeat,
        lastModifiedTime: getCurrentUtcTime(),
        createdTime: getCurrentUtcTime()
    };

    const [client, db] = await connectToDatabase();
    let response: Response;
    try {
        const collection = db.collection<GameNotSavedServer>('games');

        const gameWithId = await collection.insertOne(newGame);

        response = res.status(200).send(gameWithId.ops[0]);
    } catch (e) {
        response = res.status(500).send(e);
    }
    client.close();
    return response;
};
export const deleteGame: ControllerMethod = async (req, res) => {
    const gameToUpdateId = req.params.id;
    const [client, db] = await connectToDatabase();
    let response: Response;
    try {
        const collection = db.collection<GameServer>('games');

        const update = await collection.deleteOne({
            _id: new ObjectId(gameToUpdateId)
        });
        const nModified = update.result.n;
        if (nModified === 1) {
            response = res.status(200).send(update.result);
        } else {
            throw new Error('No matching record was found.');
        }
    } catch (e) {
        console.error(e);
        response = res.status(500).send(e);
    }
    client.close();
    return response;
};
export const updateGame: ControllerMethod = async (req, res) => {
    const gameToUpdateId = req.params.id;
    const body = req.body as GamePatchServer;
    const gameUpdate = {
        title: body.game.title,
        systems: body.game.systems,
        genres: body.game.genres,
        timeToBeat: body.game.timeToBeat
    };
    console.warn('do validation on game here', req.body);
    const [client, db] = await connectToDatabase();
    let response: Response;
    try {
        const collection = db.collection<GameServer>('games');

        const update = await collection.update(
            {
                _id: new ObjectId(gameToUpdateId)
            },
            gameUpdate
        );

        const nModified = update.result.nModified;
        if (nModified === 1) {
            response = res.status(200).send(update.result);
        } else {
            throw new Error('No matching record was found.');
        }
    } catch (e) {
        console.error(e);
        response = res.status(500).send(e);
    }
    client.close();
    return response;
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

export const getAllGames: ControllerMethod = async (
    _req: Request,
    res: Response
) => {
    const [client, db] = await connectToDatabase();
    let response: Response;
    try {
        const collection = db.collection<GameServer>('games');

        const matches = await collection.find({}).toArray();
        // console.log(matches);

        response = res.status(200).send(matches);
    } catch (e) {
        response = res.status(500).send(e);
    }
    client.close();
    return response;
};
