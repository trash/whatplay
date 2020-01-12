import * as React from 'react';
import { useSelector } from 'react-redux';
import * as Immutable from 'immutable';

import { StoreState } from '../redux/store';

import { GameComponent } from './Game';
import { gameService } from '../services/GameService';
import { Game, GameUtilities } from '../models/game.model';
import { CreateGame } from './CreateGame';
import { GameStub } from '@shared/models/game.model';

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

    const handleSubmit = async (
        event: React.FormEvent,
        game: GameStub
    ): Promise<Game> => {
        event.preventDefault();
        const created = await gameService.createGame(game);
        console.log(created);
        return created;
    };

    return (
        <div style={{ marginTop: '10px' }}>
            <CreateGame
                initialGameState={GameUtilities.newGameState()}
                onSubmit={handleSubmit}
                titleText="Add A New Game To The Database"
                submitButtonText="Submit"
            />
            <div className="notesList">
                {games.map(game => {
                    return <GameComponent key={game!.id!} game={game!} />;
                })}
            </div>
        </div>
    );
};
