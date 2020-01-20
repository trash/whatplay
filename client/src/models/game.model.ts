import { GameStub } from '@shared/models/game.model';
import { Moment } from 'moment';

export interface Game extends GameStub {
    id: string;
    lastModifiedTime: Moment;
    createdTime: Moment;
}
