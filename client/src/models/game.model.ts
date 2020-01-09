import { GameStub } from '@shared/models/game.model';

export type GamePatchServer = {};

export type GamePostServer = {};

export interface Game extends GameStub {
    id: string;
}
