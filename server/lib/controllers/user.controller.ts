import { ControllerMethod } from './ControllerMethod';
import { connectToDatabase } from '../database.util';
import { Response } from 'express';
import { FindAndModifyWriteOpResultObject, ObjectId } from 'mongodb';
import {
    UserServer,
    AddGamePost,
    GameLibraryEntryReferenceServer,
    GetGameLibraryPostClient,
    GetGameLibraryPostServer,
    UpdateGameLibraryEntryPatch
} from '@shared/models/user.model';
import { AuthenticatedRequest } from './AuthenticatedRequest';
import {
    GameLibraryEntryServer,
    PlayedStatus,
    GameRating
} from '@shared/models/game-library-entry.model';
import { getUserIdFromRequest } from '../helpers.util';
import { GameServer } from '@shared/models/game.model';

export const getUser: ControllerMethod = async (
    req: AuthenticatedRequest,
    res
) => {
    const userId = req.params.auth0Id;
    const [client, db] = await connectToDatabase();
    let response: Response;
    try {
        const collection = db.collection<UserServer>('users');

        const user = ((await collection.findOneAndUpdate(
            {
                auth0Id: userId
            },
            {
                $setOnInsert: {
                    isAdmin: false
                }
            },
            {
                upsert: true,
                returnNewDocument: true
            } as any
        )) as any) as FindAndModifyWriteOpResultObject<UserServer>;

        response = res.status(200).send(
            Object.assign(
                {
                    permissions: req.user.permissions
                },
                user.value!
            )
        );
    } catch (e) {
        console.error(e);
        response = res.status(500).send(e);
    }
    client.close();
    return response;
};

export const addGameToLibrary: ControllerMethod = async (
    req: AuthenticatedRequest,
    res
) => {
    const [client, db] = await connectToDatabase();
    let response: Response;

    const body: AddGamePost = req.body;
    if (!body.gameId) {
        const e = new Error('Missing game id');
        return res.status(400).send(e);
    }
    try {
        // 1) Create a LibraryEntry for the game
        const libraryEntryCollection = db.collection<GameLibraryEntryServer>(
            'gameLibraryEntry'
        );
        const libEntryResult = await libraryEntryCollection.insertOne({
            gameId: body.gameId,
            rating: GameRating.NotRated,
            playedStatus: PlayedStatus.NotPlayed,
            comments: '',
            dateCompleted: null,
            backlogPriority: null,
            systemsOwned: []
        });

        if (!libEntryResult.result.ok) {
            throw new Error('Error storing Game Library Entry.');
        }
        const libEntry = libEntryResult.ops[0];

        // 2) Create a LibraryEntryReference in the User document referencing
        // this newly created document
        const userLibraryEntry: GameLibraryEntryReferenceServer = {
            gameId: body.gameId,
            gameLibraryEntryId: libEntry._id.toHexString()
        };
        const userCollection = db.collection<UserServer>('users');
        const userUpdate = await userCollection.updateOne(
            {
                auth0Id: getUserIdFromRequest(req)
            },
            {
                $push: {
                    gameLibrary: userLibraryEntry
                }
            }
        );
        if (!userUpdate.result.ok || userUpdate.result.nModified === 0) {
            throw new Error('Error updating User.');
        }
        response = res.status(200).send(userLibraryEntry);
    } catch (e) {
        console.error(e);
        response = res.status(500).send(e);
    }
    client.close();
    return response;
};

export const deleteGameFromLibrary: ControllerMethod = async (
    req: AuthenticatedRequest,
    res
) => {
    const [client, db] = await connectToDatabase();
    let response: Response;

    const gameId = req.params.gameId;
    try {
        // 1) Delete the LibraryEntry
        const libraryEntryCollection = db.collection<GameLibraryEntryServer>(
            'gameLibraryEntry'
        );
        const libEntryResult = await libraryEntryCollection.deleteOne({
            gameId
        });

        if (!libEntryResult.result.ok || libEntryResult.result.n === 0) {
            throw new Error('Error deleting Game Library Entry.');
        }

        // 2) Delete the entry from the users's gameLibrary list
        const userCollection = db.collection<UserServer>('users');
        const userUpdate = await userCollection.updateOne(
            {
                auth0Id: getUserIdFromRequest(req)
            },
            {
                $pull: {
                    gameLibrary: {
                        gameId
                    }
                }
            }
        );
        if (!userUpdate.result.ok || userUpdate.result.nModified === 0) {
            throw new Error('Error updating User.');
        }
        response = res.status(204).send();
    } catch (e) {
        console.error(e);
        response = res.status(500).send(e);
    }
    client.close();
    return response;
};

export const getGameLibrary: ControllerMethod = async (
    req: AuthenticatedRequest,
    res
) => {
    const [client, db] = await connectToDatabase();
    let response: Response;

    const body: GetGameLibraryPostClient = req.body;
    if (!body.gameLibrary) {
        const e = new Error('Missing game library data.');
        return res.status(400).send(e);
    }
    try {
        // 1) Get all game library entries
        const libraryEntryCollection = db.collection<GameLibraryEntryServer>(
            'gameLibraryEntry'
        );
        const libEntries = await libraryEntryCollection
            .find({
                _id: {
                    $in: body.gameLibrary.map(
                        e => new ObjectId(e.gameLibraryEntryId)
                    )
                }
            })
            .toArray();

        // 2) Get all games
        const gameCollection = db.collection<GameServer>('games');
        const games = await gameCollection
            .find({
                _id: {
                    $in: body.gameLibrary.map(e => new ObjectId(e.gameId))
                }
            })
            .toArray();
        const responseBody: GetGameLibraryPostServer = {
            gameLibraryEntries: body.gameLibrary.map(gl => {
                const foundGame = games.find(
                    g => g._id.toHexString() === gl.gameId
                )!;
                const jsonIdGame = Object.assign({}, foundGame, {
                    _id: foundGame._id.toHexString()
                });

                const foundGameLibraryEntry = libEntries.find(
                    l => l._id.toHexString() === gl.gameLibraryEntryId
                )!;
                // console.log('matching game lib entry', foundGameLibraryEntry);
                const jsonIdGameLibraryEntry = Object.assign(
                    {},
                    foundGameLibraryEntry,
                    {
                        _id: foundGameLibraryEntry._id.toHexString()
                    }
                );

                return {
                    game: jsonIdGame,
                    gameLibraryEntry: jsonIdGameLibraryEntry
                };
            })
        };
        response = res.status(200).send(responseBody);
    } catch (e) {
        console.error(e);
        response = res.status(500).send(e);
    }
    client.close();
    return response;
};

export const updateGameLibraryEntry: ControllerMethod = async (
    req: AuthenticatedRequest,
    res
) => {
    const [client, db] = await connectToDatabase();
    let response: Response;
    const body: UpdateGameLibraryEntryPatch = req.body;
    if (!body) {
        return res.status(400).send('Invalid patch request data.');
    }

    const gameLibraryEntryId = req.params.gameLibraryEntryId;
    try {
        // Update the LibraryEntry
        const libraryEntryCollection = db.collection<GameLibraryEntryServer>(
            'gameLibraryEntry'
        );
        const libEntryResult = await libraryEntryCollection.updateOne(
            {
                _id: new ObjectId(gameLibraryEntryId)
            },
            {
                $set: body
            }
        );
        // console.log(libEntryResult, gameLibraryEntryId);

        if (!libEntryResult.result.ok || libEntryResult.result.n === 0) {
            throw new Error('Error updating Game Library Entry.');
        }
        response = res.status(204).send();
    } catch (e) {
        console.error(e);
        response = res.status(500).send(e);
    }
    client.close();
    return response;
};
