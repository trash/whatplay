import { ControllerMethod } from './ControllerMethod';
import { connectToDatabase } from '../database.util';
import { Response } from 'express';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import {
    UserServer,
    AddGamePost,
    GameLibraryEntryReferenceServer
} from '@shared/models/user.model';
import { AuthenticatedRequest } from './AuthenticatedRequest';
import { GameLibraryEntryServer } from '@shared/models/game-library-entry.model';
import { getUserIdFromRequest } from '../helpers.util';

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
            rating: null,
            playedStatus: null,
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

    const gameId = req.params.id;
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
