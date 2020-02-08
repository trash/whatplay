import React, { useState } from 'react';
import { Game } from '../models/game.model';
import { GameUtilities } from '../models/game.util';
import { CreateGame } from './CreateGame';
import { gameService } from '../services/game.service';
import classNames from 'classnames';
import { useAuth0 } from '../services/ReactAuth';
import { userService } from '../services/user.service';
import { Permission } from '@shared/models/permission.model';
import { DeleteGameButton } from './DeleteGameButton';
import { ToggleGameFromLibraryButton } from './ToggleGameFromLibraryButton';
import { gameLibraryService } from '../services/game-library.service';
import { GameRating } from '@shared/models/game-library-entry.model';
import { RatingSelect } from './RatingSelect';

type GameProps = {
    game: Game;
    onUpdate: Function;
};

export const GameComponent: React.FC<GameProps> = props => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [rating, setRating] = useState<GameRating>(GameRating.NotRated);
    const { user, isAuthenticated } = useAuth0();
    let canEdit = false;
    if (user) {
        canEdit = userService.hasPermission(user, Permission.UpdateGame);
    }

    if (isEditing) {
        const handleEditSubmit = async (
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
            props.onUpdate();
            return;
        };

        return (
            <CreateGame
                initialGameState={props.game}
                onSubmit={handleEditSubmit}
                titleText="Update Game"
                submitButtonText="Save"
                loading={isSaving}
            />
        );
    }
    const hasGameInLibrary = gameLibraryService.hasGameInLibrary(props.game);

    return (
        <div className="game">
            <div className="game_title">
                <span>{props.game.title}</span>
                <div className="game_title_controls">
                    {isAuthenticated && (
                        <React.Fragment>
                            {!hasGameInLibrary && (
                                <RatingSelect
                                    rating={rating}
                                    onChange={async updatedRating => {
                                        setRating(updatedRating);
                                        await gameLibraryService.setRatingAndAddGameToLibrary(
                                            props.game,
                                            updatedRating
                                        );
                                        setRating(GameRating.NotRated);
                                    }}
                                />
                            )}
                            <ToggleGameFromLibraryButton
                                loading={isSaving}
                                game={props.game}
                            />
                        </React.Fragment>
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
                    <DeleteGameButton
                        loading={isSaving}
                        gameId={props.game.id}
                        onDelete={() => props.onUpdate()}
                        isArchived={props.game.isArchived}
                    />
                </div>
            </div>
            <table className="game_details">
                <tbody>
                    <tr>
                        <th>Estimated Time To Beat</th>
                        <td>{props.game.timeToBeat} hours</td>
                    </tr>
                    <tr>
                        <th>Genre(s)</th>
                        <td>{GameUtilities.outputGenres(props.game)}</td>
                    </tr>
                    <tr>
                        <th>System(s)</th>
                        <td>{GameUtilities.outputSystems(props.game)}</td>
                    </tr>
                    <tr style={{ display: 'none' }}>
                        <th>Id</th>
                        <td>{props.game.id}</td>
                    </tr>
                    <tr style={{ display: 'none' }}>
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
                    {props.game.libraryCount !== null ? (
                        <tr>
                            <th># of Libraries In</th>
                            <td>{props.game.libraryCount}</td>
                        </tr>
                    ) : null}
                </tbody>
            </table>
        </div>
    );
};
