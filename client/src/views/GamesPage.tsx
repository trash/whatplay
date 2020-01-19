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
import { userService } from '../services/user.service';
import { useAuth0 } from '../services/ReactAuth';
import { Permission } from '@shared/models/permission.model';

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
            <div className="notesList">
                {games.map(game => {
                    return <GameComponent key={game!.id!} game={game!} />;
                })}
            </div>
        </div>
    );
};
