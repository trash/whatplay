import { MongoDocument, MongoDocumentJson } from './mongoDocument';

export interface UserNotSavedServer {
    auth0Id: string;
    isAdmin: boolean;
}

export interface UserServer extends MongoDocument, UserNotSavedServer {}
export interface UserServerJson extends MongoDocumentJson, UserNotSavedServer {}
