import { GameStub, GameServerJson } from '@shared/models/game.model';
import moment from 'moment';
import { Game } from './game.model';
import { PlayedStatus } from '@shared/models/game-library-entry.model';

const humanReadablePlayStatusMap: {
    [key: number]: string;
} = {
    [PlayedStatus.NotPlayed]: 'Not played'
};

// Maybe go OO at some point
export class GameUtilities {
    static transformGameServertoGame(gameServer: GameServerJson): Game {
        return {
            id: gameServer._id,
            title: gameServer.title,
            genres: gameServer.genres,
            systems: gameServer.systems,
            timeToBeat: gameServer.timeToBeat,
            lastModifiedTime: moment(
                gameServer.lastModifiedTime
                    ? gameServer.lastModifiedTime
                    : 'INVALID'
            ),
            createdTime: moment(
                gameServer.createdTime ? gameServer.createdTime : 'INVALID'
            )
        };
    }
    static newGameState(): GameStub {
        return {
            title: '',
            systems: [],
            genres: [],
            timeToBeat: 0
        };
    }
    static outputGenres(game: Game): string {
        return game.genres.reduce(
            (prev, current) => prev + (prev.length ? ', ' : '') + current,
            ''
        );
    }
    static outputSystems(game: Game): string {
        return game.systems.reduce(
            (prev, current) => prev + (prev.length ? ', ' : '') + current,
            ''
        );
    }
    static displayTime(
        game: Game,
        timeKey: 'lastModifiedTime' | 'createdTime'
    ): string {
        return game[timeKey].format('LL LTS');
    }

    // Move to a separate util?
    static playedStatus(playedStatus: PlayedStatus): string {
        return humanReadablePlayStatusMap[playedStatus];
    }
}