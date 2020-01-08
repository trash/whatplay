import React from 'react';
import { Game } from '../models/game';

type GameProps = {
    game: Game;
};

export const GameView: React.FC<GameProps> = props => {
    return <div>Game: {props.game.title}</div>;
};
