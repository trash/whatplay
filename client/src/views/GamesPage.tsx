import * as React from 'react';
import { useSelector } from 'react-redux';
import * as Immutable from 'immutable';

import { GameComponent } from '../components/Game';
import { gameService } from '../services/game.service';
import { Game } from '../models/game.model';
import { useState } from 'react';
import { RootState } from 'typesafe-actions';
import {
    PaginationControls,
    PaginationHelpers
} from '../components/PaginationControls';
import { Link } from 'react-router-dom';

type GamesPageViewProps = {
    games: Immutable.List<Game>;
    searchResultsTotalMatches: number;
    searchResultsMaxPage: number;
};

export const GamesPageView: React.FC<GamesPageViewProps> = () => {
    const { games, searchResultsMaxPage } = useSelector<
        RootState,
        GamesPageViewProps
    >(state => {
        return {
            games: state.games.searchResults,
            searchResultsMaxPage: state.games.searchResultsMaxPage,
            searchResultsTotalMatches: state.games.searchResultsTotalMatches
        };
    });
    // console.log(games);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isLoadingResults, setIsLoadingResults] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('');

    // Fetch initial results on first render
    React.useEffect(() => {
        runSearch('', currentPage);
    }, []);

    const runSearch = async (
        runSearchText: string = searchText,
        runSearchPage: number
    ) => {
        // Wrap the try for the case where it gets canceled
        try {
            setIsLoadingResults(true);
            await gameService.searchGames(runSearchText, runSearchPage);
            // console.log('matches', matches);
            setIsLoadingResults(false);
        } catch {
            return;
        }
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

    // If there's an active search we need to refresh the results when there's a change
    // We could do this more efficiently but this is fine for now
    const onGameUpdate = () => {
        if (searchText) {
            runSearch(searchText, currentPage);
        }
    };

    const updatePage = (delta: number) =>
        PaginationHelpers.updatePage(
            searchText,
            currentPage,
            delta,
            setCurrentPage,
            runSearch
        );

    // RENDERING STUFF

    // Sort client side for now
    const resultsToShow = games.sort((a, b) => {
        const aSort = a.title.toLowerCase();
        const bSort = b.title.toLowerCase();
        if (aSort < bSort) {
            return -1;
        } else if (aSort > bSort) {
            return 1;
        }
        return 0;
    });

    // What to show for the list of games depending on current search/loading state
    let resultsElements: JSX.Element[] | JSX.Element = [];
    if (isLoadingResults) {
        resultsElements = [];
    } else if (resultsToShow.size) {
        resultsElements = resultsToShow
            .map(game => {
                return (
                    <GameComponent
                        key={game!.id!}
                        game={game!}
                        onUpdate={() => onGameUpdate()}
                    />
                );
            })
            .toArray();
    } else {
        resultsElements = <h3>No results.</h3>;
    }

    const paginationControls = (
        <PaginationControls
            currentPage={currentPage}
            resultsMaxPage={searchResultsMaxPage}
            updatePage={d => updatePage(d)}
        />
    );

    return (
        <div style={{ marginTop: '10px' }}>
            <label>
                Search
                <input
                    type="text"
                    value={searchText}
                    onChange={e => searchOnChange(e)}
                />
            </label>

            {paginationControls}
            <Link
                to="/create"
                style={{ marginBottom: '10px', display: 'block' }}
            >
                Don't see what you're looking for? Add a new game to the
                database!
            </Link>
            {isLoadingResults && <h3 className="loading">Loading...</h3>}
            <div className="notesList">{resultsElements}</div>
            {!isLoadingResults && resultsToShow.size > 0 && paginationControls}
        </div>
    );
};
