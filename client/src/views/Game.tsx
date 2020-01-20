import React, { useState } from 'react';
import { Game } from '../models/game.model';
import { GameUtilities } from '../models/game.util';
import { CreateGame } from './CreateGame';
import { gameService } from '../services/game.service';
import classNames from 'classnames';
import { useAuth0 } from '../services/ReactAuth';
import { userService } from '../services/user.service';
import { Permission } from '@shared/models/permission.model';

type GameProps = {
    game: Game;
};

export const GameComponent: React.FC<GameProps> = props => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { user, isAuthenticated } = useAuth0();
    let canEdit = false;
    let canDelete = false;
    let hasGameInLibrary = false;
    if (user) {
        canEdit = userService.hasPermission(user, Permission.UpdateGame);
        canDelete = userService.hasPermission(user, Permission.DeleteGame);
        hasGameInLibrary = userService.hasGameInLibrary(props.game);
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

    const toggleGameFromLibrary = (game: Game) => {
        return userService.toggleGameFromLibrary(game);
    };

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

    return (
        <div className="game">
            <div className="game_title">
                <span>{props.game.title}</span>
                <div className="game_title_controls">
                    {isAuthenticated && (
                        <button
                            className={classNames({
                                loading: isSaving,
                                warning: hasGameInLibrary
                            })}
                            onClick={() => toggleGameFromLibrary(props.game)}
                        >
                            <span
                                className={classNames({
                                    'icon-folder-plus': !hasGameInLibrary,
                                    'icon-folder-minus': hasGameInLibrary
                                })}
                            ></span>
                            {hasGameInLibrary
                                ? 'Remove from Library'
                                : 'Add to Library'}
                        </button>
                    )}

                    {canEdit && (
                        <button
                            className={classNames({
                                loading: isSaving
                            })}
                            onClick={() => setIsEditing(true)}
                        >
                            <span className="icon-pencil"></span>
                            Edit
                        </button>
                    )}
                    {canDelete && (
                        <button
                            className={classNames('warning', {
                                loading: isSaving
                            })}
                            onClick={e => handleDelete(e)}
                        >
                            <span className="icon-bin"></span>
                            Delete
                        </button>
                    )}
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
