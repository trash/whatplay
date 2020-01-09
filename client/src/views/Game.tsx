import React from 'react';
import { Game } from '../models/game.model';

type GameProps = {
    game: Game;
};

export const GameComponent: React.FC<GameProps> = props => {
    return (
        <div className="notesList_note">
            <div className="notesList_note_header">
                <div className="notesList_note_title">
                    Game: {props.game.title}
                </div>
                <div className="notesList_note_id">
                    Time To Beat: {props.game.timeToBeat}
                </div>
                <div className="notesList_note_id">Id: {props.game.id}</div>
            </div>
        </div>
    );
};
