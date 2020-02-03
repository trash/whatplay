import { Request, Response } from 'express';
import { ObjectId, AggregationCursor, Cursor } from 'mongodb';
import {
    GameServer,
    GamePatch,
    GameNotSavedServer,
    GamePatchServer,
    GameSearchResponse,
    GameExactMatchServer
} from '@shared/models/game.model';
import { getCurrentUtcTime } from '../helpers.util';
import { ControllerMethod } from './ControllerMethod';
import { connectToDatabase } from '../database.util';
import { AuthenticatedRequest } from './AuthenticatedRequest';
import { paginationMax } from '../constants';

export const createGame: ControllerMethod = async (
    req: AuthenticatedRequest,
    res
) => {
    const newGame: GameNotSavedServer = {
        title: req.body.title,
        systems: req.body.systems,
        genres: req.body.genres,
        isModerated: false,
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
    const body = req.body as GamePatch;
    const gameUpdate = {
        title: body.game.title,
        systems: body.game.systems,
        genres: body.game.genres,
        timeToBeat: body.game.timeToBeat,
        lastModifiedTime: getCurrentUtcTime()
    };
    console.warn('do validation on game here', req.body);
    const [client, db] = await connectToDatabase();
    let response: Response;
    try {
        const collection = db.collection<GameServer>('games');

        const update = await collection.updateOne(
            {
                _id: new ObjectId(gameToUpdateId)
            },
            {
                $set: gameUpdate
            }
        );

        const nModified = update.result.nModified;
        if (nModified === 1) {
            const responseBody: GamePatchServer = {
                update: {
                    lastModifiedTime: gameUpdate.lastModifiedTime
                }
            };
            response = res.status(200).send(responseBody);
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

export const getExactTitleMatch: ControllerMethod = async (
    req: Request,
    res: Response
) => {
    const title = req.query.title || '';
    if (!title) {
        return res.status(400).send('Missing title param.');
    }
    const [client, db] = await connectToDatabase();
    let response: Response;
    try {
        const collection = db.collection<GameServer>('games');

        const match = await collection.findOne({
            title: {
                $regex: `^${title}$`,
                $options: 'i'
            }
        });

        const responsePayload: GameExactMatchServer = !!match;

        response = res.status(200).send(responsePayload);
    } catch (e) {
        response = res.status(500).send(e);
    }
    client.close();
    return response;
};

export const getAllGames: ControllerMethod = async (
    req: Request,
    res: Response
) => {
    const page = req.query.page || 0;
    const [client, db] = await connectToDatabase();
    let response: Response;
    try {
        const collection = db.collection<GameServer>('games');

        const matches = await collection
            .find({})
            .limit(paginationMax)
            .skip(page * paginationMax)
            .toArray();
        // console.log(matches);

        response = res.status(200).send(matches);
    } catch (e) {
        response = res.status(500).send(e);
    }
    client.close();
    return response;
};

export const searchGames: ControllerMethod = async (req, res) => {
    const searchTerm = req.query.search;
    const page = req.query.page || 0;
    const [client, db] = await connectToDatabase();
    let response: Response;
    try {
        const collection = db.collection<GameServer>('games');

        let matches: AggregationCursor<GameServer> | Cursor<GameServer>;
        let totalCount: number;
        if (!searchTerm) {
            matches = await collection.find({}).sort({ title: 1 });
            totalCount = await matches.count();
        } else {
            const regexMatch = {
                $match: {
                    title: {
                        $regex: searchTerm,
                        $options: 'i'
                    }
                }
            };
            matches = await collection.aggregate([
                regexMatch,
                {
                    $sort: {
                        title: 1
                    }
                }
            ]);
            const countCursor = (await collection.aggregate([
                regexMatch,
                {
                    $count: 'count'
                }
            ])) as AggregationCursor<{ count: number }>;
            const countResult = await countCursor.toArray();
            if (countResult.length) {
                totalCount = countResult[0].count;
            } else {
                totalCount = 0;
            }
        }
        // console.log(totalCount);

        const arrayMatches = await matches
            .limit(paginationMax)
            .skip(page * paginationMax)
            .toArray();
        // console.log(arrayMatches);

        const responseBody: GameSearchResponse = {
            totalCount,
            results: arrayMatches.map(g =>
                Object.assign({}, g, {
                    _id: g._id.toHexString()
                })
            ),
            maxPage: Math.floor(totalCount / paginationMax)
        };

        response = res.status(200).send(responseBody);
    } catch (e) {
        console.log(e);
        response = res.status(500).send(e);
    }

    client.close();
    return response;
};
