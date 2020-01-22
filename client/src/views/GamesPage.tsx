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
import _ from 'lodash';

type GamesPageViewProps = {
    games: Immutable.List<Game>;
};

let calledOnce = false;

export const GamesPageView: React.FC<GamesPageViewProps> = () => {
    if (!calledOnce) {
        gameService.refetchAllGames();
        calledOnce = true;
    }
    const { games } = useSelector<RootState, GamesPageViewProps>(state => {
        return {
            games: state.games.list
        };
    });
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [searchMatches, setSearchMatches] = useState<List<Game>>(List());
    const { user } = useAuth0();
    const canCreate = user
        ? userService.hasPermission(user, Permission.CreateGame)
        : false;

    const handleSubmit = async (
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
        } catch (e) {}
        setIsSaving(false);
        return;
    };

    const doSearch = async (searchText: string): Promise<Game[]> => {
        console.log('not fucking debounced');
        return await gameService.searchGames(searchText);
    };

    const debouncedSearch = _.debounce(doSearch, 1000, { leading: true });

    const searchOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = e.target.value;
        setSearchMatches(List());
        setSearchText(searchText);
        if (!searchText) {
            return;
        }
        const matches = await debouncedSearch(searchText);
        // console.log('matches', matches);
        setSearchMatches(List(matches));
    };

    return (
        <div style={{ marginTop: '10px' }}>
            {canCreate && (
                <CreateGame
                    initialGameState={GameUtilities.newGameState()}
                    onSubmit={handleSubmit}
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
            <div className="notesList">
                {(searchMatches.size ? searchMatches : games).map(game => {
                    return <GameComponent key={game!.id!} game={game!} />;
                })}
            </div>
        </div>
    );
};
