import { MongoClient, Db } from 'mongodb';
export async function connectToDatabase(): Promise<[MongoClient, Db]> {
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
