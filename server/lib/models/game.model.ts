import { GameServer, GameServerJson } from '@shared/models/game.model';

export class GameServerTransformer {
    static getGameServerJson(game: GameServer): GameServerJson {
        const gameServer = {
            ...game,
            _id: game._id.toHexString()
        };

        // There should be a type error above if we say it's a GameServerJson
        // but the type system isn't THAT good i guess. *sigh*
        delete gameServer.createdByAuth0Id;

        return gameServer;
    }
}
