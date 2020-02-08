import { GameServer, GameServerJson } from '@shared/models/game.model';
import { Request } from 'express';
import { Permission } from '@shared/models/permission.model';
import { PermissionUtil } from '../util/permission.util';

export class GameServerTransformer {
    static getGameServerJson(req: Request, game: GameServer): GameServerJson {
        const gameServer = {
            ...game,
            _id: game._id.toHexString()
        };

        // There should be a type error above if we say it's a GameServerJson
        // but the type system isn't THAT good i guess. *sigh*
        delete gameServer.createdByAuth0Id;
        // Only show deleted status for people with the proper perm
        if (!PermissionUtil.hasPermission(req, Permission.DeleteGame)) {
            delete gameServer.isArchived;
        }

        return gameServer;
    }
}
