import { ControllerMethod } from './ControllerMethod';
import { connectToDatabase } from '../database.util';
import { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
    UserServer,
    AddGamePost,
    GameLibraryEntryReferenceServer,
    UpdateGameLibraryEntryPatch
} from '@shared/models/user.model';
import { AuthenticatedRequest } from './AuthenticatedRequest';
import {
    GameLibraryEntryServer,
    PlayedStatus,
    GameRating,
    BacklogPriority,
    GameLibraryEntryServerWithGame,
    GameLibrarySearchResponse,
    gameLibrarySortMap
} from '@shared/models/game-library-entry.model';
import { getUserIdFromRequest as getUserAuth0IdFromRequest } from '../helpers.util';
import { paginationMax } from '../constants';
import { performance } from 'perf_hooks';
import { MongoDto } from '../models/database.model';
import { GameLibraryCountHelper } from '@shared/util/game-library-count';

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
    if (body.rating !== undefined && !validateRating(body.rating)) {
        return res.status(400).send('Invalid rating value.');
    }
    try {
        // 1) Create a LibraryEntry for the game
        const libraryEntryCollection = db.collection<GameLibraryEntryServer>(
            'gameLibraryEntry'
        );
        const libEntryResult = await libraryEntryCollection.insertOne({
            gameId: new ObjectId(body.gameId),
            userAuth0Id: getUserAuth0IdFromRequest(req),
            rating: body.rating || GameRating.NotRated,
            playedStatus: PlayedStatus.NotPlayed,
            comments: '',
            dateCompleted: null,
            backlogPriority: BacklogPriority.None,
            systemsOwned: []
        });

        if (!libEntryResult.result.ok) {
            throw new Error('Error storing Game Library Entry.');
        }
        const libEntry = libEntryResult.ops[0];

        // 2) Create a LibraryEntryReference in the User document referencing
        // this newly created document
        const userLibraryEntry: GameLibraryEntryReferenceServer = {
            gameId: new ObjectId(body.gameId),
            gameLibraryEntryId: libEntry._id
        };
        const userCollection = db.collection<UserServer>('users');
        const userUpdate = await userCollection.updateOne(
            {
                auth0Id: getUserAuth0IdFromRequest(req)
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

        // 3) Update count for game
        // TODO: parallelize
        const gameLibraryCount = new GameLibraryCountHelper(db);
        await gameLibraryCount.incrementGameCount(body.gameId);

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

    const gameId = new ObjectId(req.params.gameId);
    try {
        // 1) Delete the LibraryEntry
        const libraryEntryCollection = db.collection<GameLibraryEntryServer>(
            'gameLibraryEntry'
        );
        const libEntryResult = await libraryEntryCollection.deleteOne({
            gameId,
            userAuth0Id: getUserAuth0IdFromRequest(req)
        });

        if (!libEntryResult.result.ok) {
            throw new Error('Error deleting Game Library Entry.');
        }

        // Don't error so that the rest of the delete still goes through
        if (libEntryResult.result.n === 0) {
            console.error('Could not find game library entry to delete');
        }

        // 2) Delete the entry from the users's gameLibrary list
        const userCollection = db.collection<UserServer>('users');
        const userUpdate = await userCollection.updateOne(
            {
                auth0Id: getUserAuth0IdFromRequest(req)
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

        // 3) Update game count
        // TODO: parallelize this
        const gameLibraryCount = new GameLibraryCountHelper(db);
        await gameLibraryCount.decrementGameCount(req.params.gameId);

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

    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).send('Missing userId.');
    }
    const page = req.query.page || 0;
    const searchTerm = req.query.search || '';
    const sortInQuery = req.query.sort;
    const sort = gameLibrarySortMap.get(parseInt(sortInQuery));
    try {
        const libraryEntryCollection = db.collection<GameLibraryEntryServer>(
            'gameLibraryEntry'
        );

        const gameLibraryFindFilter = {
            $match: {
                userAuth0Id: userId
            }
        };

        const gameLibraryJoin = {
            $lookup: {
                from: 'games',
                localField: 'gameId',
                foreignField: '_id',
                as: 'game'
            }
        };

        const regexMatch = {
            $match: {
                'game.title': {
                    $regex: searchTerm,
                    $options: 'i'
                }
            }
        };

        const sortByGameTitle = {
            $sort: {
                'game.title': 1
            }
        };

        const sorts: object[] = [sortByGameTitle];
        console.log(sortInQuery, sort);
        if (sort) {
            const secondarySort = {
                $sort: {
                    [sort.sortKey]: sort.defaultSort
                }
            };
            console.log(secondarySort);

            sorts.push(secondarySort);
        }

        const resultsWrap = {
            $facet: {
                results: [
                    { $skip: page * paginationMax },
                    { $limit: paginationMax }
                ],
                totalCount: [
                    {
                        $count: 'count'
                    }
                ]
            }
        };

        const aggregationSteps: object[] = [
            gameLibraryFindFilter,
            gameLibraryJoin,
            ...sorts,
            resultsWrap
        ];
        if (searchTerm) {
            aggregationSteps.splice(2, 0, regexMatch);
        }
        const before = performance.now();
        const aggregateResultList = ((await libraryEntryCollection
            .aggregate(aggregationSteps)
            .toArray()) as unknown) as MongoDto<GameLibraryEntryServerWithGame>;
        const aggregateResult = aggregateResultList[0];

        const libEntries = aggregateResult.results;

        const queryTime = performance.now() - before;
        console.log(queryTime);

        // console.log(aggregateResult);

        const totalCount = aggregateResult.totalCount[0]?.count || 0;

        const responseBody: GameLibrarySearchResponse = {
            totalCount,
            maxPage: Math.floor(totalCount / paginationMax),
            results: libEntries.map(libEntry => {
                const game = libEntry.game[0];
                const jsonIdGame = Object.assign({}, game, {
                    _id: game._id.toHexString()
                });
                const jsonIdGameLibraryEntry = Object.assign({}, libEntry, {
                    _id: libEntry._id.toHexString(),
                    gameId: libEntry.gameId.toHexString()
                });

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

// Return true if it's valid
const validateRating = (rating: GameRating | null | undefined): boolean => {
    if (rating === null || rating === undefined) {
        return true;
    }
    return GameRating[rating] !== undefined;
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
    if (!validateRating(body.rating)) {
        return res.status(400).send('Invalid rating value.');
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
