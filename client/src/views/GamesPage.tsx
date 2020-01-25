import * as React from 'react';
import { useSelector } from 'react-redux';
import * as Immutable from 'immutable';

import { GameComponent } from '../components/Game';
import { gameService } from '../services/game.service';
import { Game } from '../models/game.model';
import { GameUtilities } from '../models/game.util';
import { CreateGame } from '../components/CreateGame';
import { GameStub } from '@shared/models/game.model';
import { useState } from 'react';
import { RootState } from 'typesafe-actions';
import { userService } from '../services/user.service';
import { useAuth0 } from '../services/ReactAuth';
import { Permission } from '@shared/models/permission.model';
import { List } from 'immutable';
import debounce from '../util/debounce';

type GamesPageViewProps = {
    games: Immutable.List<Game>;
};

const doSearch = async (
    searchText: string,
    currentPage: number
): Promise<Game[]> => {
    const games = await gameService.searchGames(searchText, currentPage);
    // console.log('doSearch', searchText, games.length);
    return games;
};

const debouncedSearch = debounce(doSearch, 250);

export const GamesPageView: React.FC<GamesPageViewProps> = () => {
    const { games } = useSelector<RootState, GamesPageViewProps>(state => {
        return {
            games: state.games.list
        };
    });
    console.log(games);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoadingResults, setIsLoadingResults] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('');
    const [searchMatches, setSearchMatches] = useState<List<Game>>(List());
    const { user } = useAuth0();
    const canCreate = user
        ? userService.hasPermission(user, Permission.CreateGame)
        : false;

    const refetch = async () => {
        // await gameService.refetchAllGames();
        runSearch('', currentPage);
        // setIsLoadingResults(false);
    };

    React.useEffect(() => {
        refetch();
    }, []);

    const onCreateGame = async (
        event: React.FormEvent,
        game: GameStub
    ): Promise<void> => {
        event.preventDefault();
        if (isSaving) {
            return;
        }
        setIsSaving(true);
        try {
            await gameService.createGame(game);
            onGameUpdate();
        } catch (e) {}
        setIsSaving(false);

        return;
    };

    const runSearch = async (
        runSearchText: string = searchText,
        runSearchPage: number
    ) => {
        // Wrap the try for the case where it gets canceled
        try {
            setIsLoadingResults(true);
            const matches = await debouncedSearch(runSearchText, runSearchPage);
            // console.log('matches', matches);
            setSearchMatches(List(matches));
            setIsLoadingResults(false);
        } catch {
            return;
        }
    };

    const searchOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = e.target.value;
        setSearchMatches(List());
        setSearchText(searchText);
        runSearch(searchText, currentPage);
    };

    // If there's an active search we need to refresh the results when there's a change
    // We could do this more efficiently but this is fine for now
    const onGameUpdate = () => {
        if (searchText) {
            runSearch(searchText, currentPage);
        }
    };

    const updatePage = (delta: number) => {
        let nextPage = currentPage + delta;
        if (nextPage < 0) {
            nextPage = 0;
        }
        if (nextPage === currentPage) {
            return;
        }
        setCurrentPage(nextPage);
        runSearch(searchText, nextPage);
    };

    // Render stuff
    // Sort client side for now
    const resultsToShow = searchMatches.sort((a, b) => {
        const aSort = a.title.toLowerCase();
        const bSort = b.title.toLowerCase();
        if (aSort < bSort) {
            return -1;
        } else if (aSort > bSort) {
            return 1;
        }
        return 0;
    });
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

    return (
        <div style={{ marginTop: '10px' }}>
            {canCreate && (
                <CreateGame
                    initialGameState={GameUtilities.newGameState()}
                    onSubmit={onCreateGame}
                    titleText="Add A New Game To The Database"
                    submitButtonText="Submit"
                    loading={isSaving}
                />
            )}
            <label>
                Search
                <input
                    type="text"
                    value={searchText}
                    onChange={e => searchOnChange(e)}
                />
            </label>

            {isLoadingResults && <h3 className="loading">Loading...</h3>}
            <div className="paginationControls">
                <button onClick={() => updatePage(-1)}>Previous</button>
                <div>Page {currentPage}</div>
                <button onClick={() => updatePage(+1)}>Next</button>
            </div>
            <div className="notesList">{resultsElements}</div>
        </div>
    );
};
