import { MongoDocument, MongoDocumentJson } from './mongoDocument';
import { Permission } from './permission.model';

export interface UserNotSavedServer {
    auth0Id: string;
    isAdmin: boolean;
}

export interface UserServer extends MongoDocument, UserNotSavedServer {}
export interface UserServerJson extends MongoDocumentJson, UserNotSavedServer {
    permissions: Permission[];
}
