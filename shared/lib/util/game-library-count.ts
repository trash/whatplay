import { Db, Collection } from 'mongodb';

export type GameLibraryCount = {
    [key: string]: number;
};

export class GameLibraryCountHelper {
    private collection: Collection<GameLibraryCount>;

    constructor(private db: Db) {
        this.collection = this.db.collection<GameLibraryCount>(
            'gameLibraryCount'
        );
    }

    async get(): Promise<GameLibraryCount> {
        // TODO: Speed up this call by parallelizing some of it
        const count = await this.collection.findOne({});
        if (count === null) {
            throw new Error('Error fetching count.');
        }
        return count;
    }

    private async updateGameCount(
        gameId: string,
        delta: 1 | -1
    ): Promise<void> {
        await this.collection.updateOne(
            {},
            {
                $inc: {
                    [gameId]: delta
                }
            }
        );
        return;
    }

    async incrementGameCount(gameId: string) {
        return this.updateGameCount(gameId, 1);
    }

    async decrementGameCount(gameId: string) {
        return this.updateGameCount(gameId, -1);
    }
}
