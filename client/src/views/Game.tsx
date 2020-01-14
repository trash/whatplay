import React, { useState } from 'react';
import { Game, GameUtilities } from '../models/game.model';
import { CreateGame } from './CreateGame';
import { gameService } from '../services/GameService';
import classNames from 'classnames';

type GameProps = {
    game: Game;
};

export const GameComponent: React.FC<GameProps> = props => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    if (isEditing) {
        const handleSubmit = async (
            event: React.FormEvent,
            game: Game
        ): Promise<void> => {
            event.preventDefault();
            if (isSaving) {
                return;
            }
            setIsSaving(true);
            await gameService.updateGame(game);
            // If it succeeds close the edit view
            setIsEditing(false);
            setIsSaving(false);
            return;
        };

        return (
            <CreateGame
                initialGameState={props.game}
                onSubmit={handleSubmit}
                titleText="Update Game"
                submitButtonText="Save"
                loading={isSaving}
            />
        );
    }
    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) {
            return;
        }
        if (window.confirm('Are you sure you want to delete this game?')) {
            setIsSaving(true);
            await gameService.deleteGame(props.game.id);
            setIsSaving(false);
        }
    };
    return (
        <div className="game">
            <div className="game_title">
                <span>Game: {props.game.title}</span>
                <div className="game_title_controls">
                    <button
                        className={classNames({
                            loading: isSaving
                        })}
                        onClick={() => setIsEditing(true)}
                    >
                        <span className="icon-pencil"></span>
                        Edit
                    </button>
                    <button
                        className={classNames('warning', {
                            loading: isSaving
                        })}
                        onClick={e => handleDelete(e)}
                    >
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
                    <tr>
                        <th>Time Created</th>
                        <td>
                            {GameUtilities.displayTime(
                                props.game,
                                'createdTime'
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>Time Last Modified</th>
                        <td>
                            {GameUtilities.displayTime(
                                props.game,
                                'lastModifiedTime'
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
