import React, { useState } from 'react';
import { Game, GameUtilities } from '../models/game.model';
import { CreateGame } from './CreateGame';
import { gameService } from '../services/GameService';

type GameProps = {
    game: Game;
};

export const GameComponent: React.FC<GameProps> = props => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    if (isEditing) {
        const handleSubmit = async (
            event: React.FormEvent,
            game: Game
        ): Promise<Game> => {
            event.preventDefault();
            const created = await gameService.updateGame(game);
            // If it succeeds close the edit view
            setIsEditing(false);
            return created;
        };

        return (
            <CreateGame
                initialGameState={props.game}
                onSubmit={handleSubmit}
                titleText="Update Game"
                submitButtonText="Save"
            />
        );
    }
    return (
        <div className="game">
            <div className="game_title">
                <span>Game: {props.game.title}</span>
                <div className="game_title_controls">
                    <button onClick={() => setIsEditing(true)}>
                        <span className="icon-pencil"></span>
                        Edit
                    </button>
                    <button className="warning">
                        <span className="icon-bin"></span>
                        Delete
                    </button>
                </div>
            </div>
            <table className="game_details">
                <tbody>
                    <tr>
                        <th>Time To Beat</th>
                        <td>{props.game.timeToBeat}</td>
                    </tr>
                    <tr>
                        <th>Genre(s)</th>
                        <td>{GameUtilities.outputGenres(props.game)}</td>
                    </tr>
                    <tr>
                        <th>System(s)</th>
                        <td>{GameUtilities.outputSystems(props.game)}</td>
                    </tr>
                    <tr>
                        <th>Id</th>
                        <td>{props.game.id}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
