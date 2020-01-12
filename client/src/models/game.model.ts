import { GameStub } from '@shared/models/game.model';

export type GamePatchServer = {};

export type GamePostServer = {};

export interface Game extends GameStub {
    id: string;
}

// Maybe go OO at some point
export class GameUtilities {
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
}
