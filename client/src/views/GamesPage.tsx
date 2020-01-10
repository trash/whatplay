import * as React from 'react';
import { useSelector } from 'react-redux';
import * as Immutable from 'immutable';

import { StoreState } from '../redux/store';

import { GameComponent } from './Game';
import { gameService } from '../services/GameService';
import { Game } from '../models/game.model';
import { CreateGame } from './CreateGame';

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
    return (
        <div style={{ marginTop: '10px' }}>
            <CreateGame />
            <div className="notesList">
                {games.map(game => {
                    return <GameComponent key={game!.id!} game={game!} />;
                })}
            </div>
        </div>
    );
};
