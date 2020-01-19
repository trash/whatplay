import { ControllerMethod } from './ControllerMethod';
import { connectToDatabase } from '../database.util';
import { Response } from 'express';
import { FindAndModifyWriteOpResultObject } from '@shared/node_modules/@types/mongodb';
import { UserServer } from '@shared/models/user.model';
import { AuthenticatedRequest } from './AuthenticatedRequest';

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
