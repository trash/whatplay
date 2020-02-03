import { GameStub, GameServerJson } from '@shared/models/game.model';
import moment from 'moment';
import { Game } from './game.model';
import {
    GameLibraryEntryClient,
    backlogPriorityHumanReadableMap,
    playedStatusHumanReadableMap,
    ratingHumanReadableMap
} from '@shared/models/game-library-entry.model';
import { GameLibraryService } from '../services/game-library.service';

// Maybe go OO at some point
export class GameUtilities {
    static transformGameServertoGame(gameServer: GameServerJson): Game {
        return {
            id: gameServer._id,
            title: gameServer.title,
            genres: gameServer.genres,
            systems: gameServer.systems,
            isModerated: gameServer.isModerated,
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
            isModerated: false,
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

    static backlogPriority(gameLibraryEntry: GameLibraryEntryClient): string {
        if (gameLibraryEntry.backlogPriority === null) {
            return '';
        }
        return (
            backlogPriorityHumanReadableMap.get(
                gameLibraryEntry.backlogPriority
            ) || ''
        );
    }

    static playedStatus(gameLibraryEntry: GameLibraryEntryClient): string {
        if (gameLibraryEntry.playedStatus === null) {
            return '';
        }
        return (
            playedStatusHumanReadableMap.get(gameLibraryEntry.playedStatus)
            || ''
        );
    }

    static rating(gameLibraryEntry: GameLibraryEntryClient): string {
        if (gameLibraryEntry.rating === null) {
            return '';
        }
        return ratingHumanReadableMap.get(gameLibraryEntry.rating) || '';
    }

    static updateGameLibraryEntry<K extends keyof GameLibraryEntryClient>(
        gameLibraryService: GameLibraryService,
        gameLibraryEntryToUpdate: GameLibraryEntryClient,
        property: K,
        value: GameLibraryEntryClient[K]
    ) {
        console.log(gameLibraryEntryToUpdate, property, value);
        gameLibraryService.updateGameLibraryEntry(gameLibraryEntryToUpdate, {
            [property]: value
        });
    }
}
