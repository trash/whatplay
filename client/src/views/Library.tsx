import * as React from 'react';
import { connect, useSelector } from 'react-redux';

import { RootState } from 'typesafe-actions';
import { GameLibraryEntryReferenceClient } from '@shared/models/user.model';
import { List } from 'immutable';
import { HydratedGameLibraryClient } from '../models/user.model';
import { ToggleGameFromLibraryButton } from '../components/ToggleGameFromLibraryButton';
import {
    backlogPriorityArray,
    playedStatusArray,
    GameLibrarySort
} from '@shared/models/game-library-entry.model';
import { useState } from 'react';
import { gameLibraryService } from '../services/game-library.service';
import {
    PaginationControls,
    PaginationHelpers
} from '../components/PaginationControls';
import classNames from 'classnames';
import { useParams } from 'react-router';
import { useAuth0 } from '../services/ReactAuth';
import { GameUtilities } from '../models/game.util';
import { RatingSelect } from '../components/RatingSelect';

interface LibraryProps {
    results: HydratedGameLibraryClient;
    resultsTotalMatches: number;
    resultsMaxPage: number;
}

export const LibraryPage: React.FC<LibraryProps> = () => {
    const { user } = useAuth0();
    const { userId } = useParams();
    console.log('get lib for', userId);
    // const user =
    if (!userId) {
        return null;
    }
    const canEdit = user?.auth0Id === userId;
    const {
        library,
        results,
        // resultsTotalMatches,
        resultsMaxPage
    } = useSelector<
        RootState,
        {
            library: List<GameLibraryEntryReferenceClient>;
            results: HydratedGameLibraryClient;
            // resultsTotalMatches: number;
            resultsMaxPage: number;
        }
    >(state => {
        return {
            library: state.gameLibrary.gameLibrary,
            results: state.gameLibrary.searchResults,
            // resultsTotalMatches: state.gameLibrary.searchResultsTotalMatches,
            resultsMaxPage: state.gameLibrary.searchResultsMaxPage
        };
    });

    //
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
            await gameLibraryService.debouncedGetAllLibraryGames(
                userId,
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
        // await gameLibraryService.getAllLibraryGames(library);
        await runSearch(searchText, currentPage);
        setIsLoadingResults(false);
    };

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

    const updatePage = (delta: number) =>
        PaginationHelpers.updatePage(
            searchText,
            currentPage,
            delta,
            setCurrentPage,
            runSearch
        );
    //
    //

    //
    // Sort stuff

    const [currentSort, setCurrentSort] = useState<GameLibrarySort>(
        GameLibrarySort.GameTitle
    );
    const [isSortReversed, setIsSortReversed] = useState<boolean>(false);
    const sortClick = (e: React.MouseEvent, sort: GameLibrarySort) => {
        e.preventDefault();
        if (currentSort !== sort) {
            setCurrentSort(sort);
            setIsSortReversed(false);
        } else {
            setIsSortReversed(!isSortReversed);
        }
    };
    //
    //

    // Fetch all lib games
    React.useEffect(() => {
        fetchFunc();
    }, [library]);

    const paginationControls = (
        <PaginationControls
            currentPage={currentPage}
            resultsMaxPage={resultsMaxPage}
            updatePage={d => updatePage(d)}
        />
    );

    const tableContent = !isLoadingResults ? (
        <React.Fragment>
            {paginationControls}
            <div className="tableWrap">
                <table className="table libraryTable">
                    <thead>
                        <tr>
                            <th className="gameTitleColumn">Game</th>
                            <th
                                className={classNames('x-sortableColumn', {
                                    'sortableColumn--active':
                                        currentSort
                                        === GameLibrarySort.BacklogPriority,
                                    'sortableColumn--reversed': isSortReversed
                                })}
                                onClick={e =>
                                    sortClick(
                                        e,
                                        GameLibrarySort.BacklogPriority
                                    )
                                }
                            >
                                Backlog Priority
                            </th>
                            <th className="timeToBeatColumn">
                                Estimated Time To Beat
                            </th>
                            <th>Played Status</th>
                            <th>Your Rating</th>
                            <th style={{ display: 'none' }}>Systems Owned</th>
                            <th style={{ display: 'none' }}>Id</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(entry => (
                            <tr key={entry?.gameLibraryEntry._id}>
                                <td>{entry?.game.title}</td>
                                <td>
                                    {canEdit ? (
                                        <select
                                            onChange={e =>
                                                GameUtilities.updateGameLibraryEntry(
                                                    gameLibraryService,
                                                    entry?.gameLibraryEntry!,
                                                    'backlogPriority',
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            value={
                                                entry?.gameLibraryEntry
                                                    .backlogPriority!
                                            }
                                        >
                                            {backlogPriorityArray.map(
                                                priority => (
                                                    <option
                                                        key={priority.value}
                                                        value={priority.value}
                                                    >
                                                        {priority.text}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    ) : (
                                        GameUtilities.backlogPriority(
                                            entry?.gameLibraryEntry!
                                        )
                                    )}
                                </td>
                                <td>{entry?.game.timeToBeat}</td>
                                <td>
                                    {canEdit ? (
                                        <select
                                            onChange={e =>
                                                GameUtilities.updateGameLibraryEntry(
                                                    gameLibraryService,
                                                    entry?.gameLibraryEntry!,
                                                    'playedStatus',
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            value={
                                                entry?.gameLibraryEntry
                                                    .playedStatus!
                                            }
                                        >
                                            {playedStatusArray.map(
                                                playedStatus => (
                                                    <option
                                                        key={playedStatus.value}
                                                        value={
                                                            playedStatus.value
                                                        }
                                                    >
                                                        {playedStatus.text}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    ) : (
                                        GameUtilities.playedStatus(
                                            entry?.gameLibraryEntry!
                                        )
                                    )}
                                </td>
                                <td>
                                    {canEdit ? (
                                        <RatingSelect
                                            rating={
                                                entry?.gameLibraryEntry.rating!
                                            }
                                            onChange={updatedRating =>
                                                GameUtilities.updateGameLibraryEntry(
                                                    gameLibraryService,
                                                    entry?.gameLibraryEntry!,
                                                    'rating',
                                                    updatedRating
                                                )
                                            }
                                        />
                                    ) : (
                                        GameUtilities.rating(
                                            entry?.gameLibraryEntry!
                                        )
                                    )}
                                </td>

                                <td style={{ display: 'none' }}>
                                    {entry?.gameLibraryEntry.systemsOwned}
                                </td>
                                <td style={{ display: 'none' }}>
                                    {entry?.gameLibraryEntry._id}
                                </td>
                                {canEdit ? (
                                    <td>
                                        <ToggleGameFromLibraryButton
                                            game={entry?.game!}
                                            shortText={true}
                                        />
                                    </td>
                                ) : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {paginationControls}
        </React.Fragment>
    ) : (
        <div className="loading" style={{ marginBottom: '10px' }}>
            Loading...
        </div>
    );

    return (
        <section>
            <h1>
                {canEdit ? 'My Game Library' : "Someone Else's Game Library"}
            </h1>
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
