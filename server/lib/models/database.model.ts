interface MongoDtoEntry<T> {
    results: T[];
    totalCount: [
        {
            count: number;
        }
    ];
}

export type MongoDto<T> = [MongoDtoEntry<T>];
