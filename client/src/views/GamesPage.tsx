import * as React from 'react';
import { useSelector } from 'react-redux';
import * as Immutable from 'immutable';

import { StoreState } from '../redux/store';

import { GameView } from './Game';
import { gameService } from '../services/GameService';
import { Game } from '../models/game';

type GamesPageViewProps = {
    games: Immutable.List<Game>;
};

let calledOnce = false;

export const GamesPageView2: React.FC<GamesPageViewProps> = () => {
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
            <div className="notesList">
                {games.map(game => {
                    return <GameView key={game!.id} game={game!} />;
                })}
            </div>
        </div>
    );
};
