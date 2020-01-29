import * as React from 'react';
import { connect, useSelector } from 'react-redux';

import { useAuth0 } from '../services/ReactAuth';
import { RootState } from 'typesafe-actions';
import { GameLibraryEntryReferenceClient } from '@shared/models/user.model';
import { List } from 'immutable';
import { HydratedGameLibraryClient } from '../models/user.model';
import { ToggleGameFromLibraryButton } from '../components/ToggleGameFromLibraryButton';
import {
    gameRatingsArray,
    GameLibraryEntryClient,
    backlogPriorityArray,
    playedStatusArray
} from '@shared/models/game-library-entry.model';
import { useState } from 'react';
import { gameService } from '../services/game.service';
import { gameLibraryService } from '../services/game-library.service';

interface LibraryProps {}

export const LibraryPage: React.FC<LibraryProps> = () => {
    const { user } = useAuth0();
    if (!user) {
        return null;
    }
    const { library, hydratedLibrary: hydratedGameLibrary } = useSelector<
        RootState,
        {
            library: List<GameLibraryEntryReferenceClient>;
            hydratedLibrary: HydratedGameLibraryClient;
        }
    >(state => {
        return {
            library: state.gameLibrary.gameLibrary,
            hydratedLibrary: state.gameLibrary.hydratedGameLibrary
        };
    });

    // Search/pagination stuff
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [searchText, setSearchText] = useState<string>('');
    const [isLoadingResults, setIsLoadingResults] = useState<boolean>(true);

    const runSearch = async (
        runSearchText: string = searchText,
        runSearchPage: number
    ) => {
        // Wrap the try for the case where it gets canceled
        try {
            setIsLoadingResults(true);
            await gameService.debouncedSearchGames(
                runSearchText,
                runSearchPage
            );
            // console.log('matches', matches);
            setIsLoadingResults(false);
        } catch {
            return;
        }
    };

    const fetchFunc = async () => {
        await gameLibraryService.getAllLibraryGames(library);
        setIsLoadingResults(false);
    };

    // Fetch all lib games
    React.useEffect(() => {
        fetchFunc();
    }, [library]);

    const searchOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchText = e.target.value;
        let page = currentPage;
        if (searchText !== newSearchText) {
            setCurrentPage(0);
            page = 0;
        }
        setSearchText(newSearchText);
        runSearch(newSearchText, page);
    };

    // console.log(hydratedGameLibrary);

    function updateFunction<K extends keyof GameLibraryEntryClient>(
        gameLibraryEntryToUpdate: GameLibraryEntryClient,
        property: K,
        value: GameLibraryEntryClient[K]
    ) {
        console.log(gameLibraryEntryToUpdate, property, value);
        gameLibraryService.updateGameLibraryEntry(gameLibraryEntryToUpdate, {
            [property]: value
        });
    }

    const tableContent = !isLoadingResults ? (
        <table className="table">
            <thead>
                <tr>
                    <th>Game</th>
                    <th>Estimated Time To Beat</th>
                    <th>Played Status</th>
                    <th>Your Rating</th>
                    <th>Backlog Priority</th>
                    <th style={{ display: 'none' }}>Systems Owned</th>
                    <th style={{ display: 'none' }}>Id</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {hydratedGameLibrary.map(entry => (
                    <tr key={entry?.gameLibraryEntry._id}>
                        <td>{entry?.game.title}</td>
                        <td>{entry?.game.timeToBeat}</td>
                        <td>
                            <select
                                onChange={e =>
                                    updateFunction(
                                        entry?.gameLibraryEntry!,
                                        'playedStatus',
                                        parseInt(e.target.value)
                                    )
                                }
                                value={entry?.gameLibraryEntry.playedStatus!}
                            >
                                {playedStatusArray.map(playedStatus => (
                                    <option
                                        key={playedStatus.value}
                                        value={playedStatus.value}
                                    >
                                        {playedStatus.text}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <select
                                onChange={e =>
                                    updateFunction(
                                        entry?.gameLibraryEntry!,
                                        'rating',
                                        parseInt(e.target.value)
                                    )
                                }
                                value={entry?.gameLibraryEntry.rating!}
                            >
                                {gameRatingsArray.map(rating => (
                                    <option
                                        key={rating.value}
                                        value={rating.value}
                                    >
                                        {rating.text}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <select
                                onChange={e =>
                                    updateFunction(
                                        entry?.gameLibraryEntry!,
                                        'backlogPriority',
                                        parseInt(e.target.value)
                                    )
                                }
                                value={entry?.gameLibraryEntry.backlogPriority!}
                            >
                                {backlogPriorityArray.map(priority => (
                                    <option
                                        key={priority.value}
                                        value={priority.value}
                                    >
                                        {priority.text}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td style={{ display: 'none' }}>
                            {entry?.gameLibraryEntry.systemsOwned}
                        </td>
                        <td style={{ display: 'none' }}>
                            {entry?.gameLibraryEntry._id}
                        </td>
                        <td>
                            <ToggleGameFromLibraryButton
                                game={entry?.game!}
                                shortText={true}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <div className="loading" style={{ marginBottom: '10px' }}>
            Loading...
        </div>
    );

    return (
        <section>
            <h1>Game Library</h1>
            <label>
                Search
                <input
                    type="text"
                    value={searchText}
                    onChange={e => searchOnChange(e)}
                />
            </label>
            {tableContent}
        </section>
    );
};

export const ConnectedLibraryPage = connect((_state: RootState) => {
    return {};
})(LibraryPage);
