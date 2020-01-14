import { ObjectId } from 'mongodb';
export interface MongoDocument {
    _id: ObjectId;
}

export interface MongoDocumentJson {
    _id: string;
}
