import * as React from 'react';
import { useSelector } from 'react-redux';
import * as Immutable from 'immutable';

import { GameComponent } from './Game';
import { gameService } from '../services/game.service';
import { Game, GameUtilities } from '../models/game.model';
import { CreateGame } from './CreateGame';
import { GameStub } from '@shared/models/game.model';
import { useState } from 'react';
import { RootState } from 'typesafe-actions';

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
    const { isAdmin } = useSelector<
        RootState,
        {
            isAdmin: boolean;
        }
    >(state => {
        return {
            isAdmin: state.user.isAdmin
        };
    });

    return (
        <div style={{ marginTop: '10px' }}>
            {isAdmin && (
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
