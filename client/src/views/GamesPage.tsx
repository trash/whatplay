import * as React from 'react';
import { useSelector } from 'react-redux';
import * as Immutable from 'immutable';

import { StoreState } from '../redux/store';

import { GameComponent } from './Game';
import { gameService } from '../services/game.service';
import { Game, GameUtilities } from '../models/game.model';
import { CreateGame } from './CreateGame';
import { GameStub } from '@shared/models/game.model';
import { useState } from 'react';
import { useAuth0 } from '../services/ReactAuth';

type GamesPageViewProps = {
    games: Immutable.List<Game>;
};

let calledOnce = false;

export const GamesPageView: React.FC<GamesPageViewProps> = () => {
    if (!calledOnce) {
        gameService.refetchAllGames();
        calledOnce = true;
    }
    const { games } = useSelector<StoreState, GamesPageViewProps>(
        (state: StoreState) => {
            return {
                games: state.games
            };
        }
    );
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const handleSubmit = async (
        event: React.FormEvent,
        game: GameStub
    ): Promise<void> => {
        event.preventDefault();
        if (isSaving) {
            return;
        }
        setIsSaving(true);
        await gameService.createGame(game);
        setIsSaving(false);
        return;
    };

    const { isAuthenticated, user } = useAuth0();
    console.log(user);
    return (
        <div style={{ marginTop: '10px' }}>
            {isAuthenticated && (
                <CreateGame
                    initialGameState={GameUtilities.newGameState()}
                    onSubmit={handleSubmit}
                    titleText="Add A New Game To The Database"
                    submitButtonText="Submit"
                    loading={isSaving}
                />
            )}
            <div className="notesList">
                {games.map(game => {
                    return <GameComponent key={game!.id!} game={game!} />;
                })}
            </div>
        </div>
    );
};
