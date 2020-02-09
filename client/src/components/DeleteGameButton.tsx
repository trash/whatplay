import React, { useState } from 'react';
import classNames from 'classnames';
import { gameService } from '../services/game.service';
import { useAuth0 } from '../services/ReactAuth';
import { userService } from '../services/user.service';
import { Permission } from '@shared/models/permission.model';

type DeleteGameButtonProps = {
    gameId: string;
    loading?: boolean;
    onDelete: Function;
    isArchived: boolean | null;
};

export const DeleteGameButton: React.FC<DeleteGameButtonProps> = props => {
    const [isUpdating, setIsUpdated] = useState<boolean>(false);
    const { user } = useAuth0();
    let canDelete = false;
    if (user) {
        canDelete = userService.hasPermission(user, Permission.DeleteGame);
    }
    if (!canDelete) {
        return null;
    }

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isUpdating) {
            return;
        }
        if (window.confirm('Are you sure you want to archive this game?')) {
            setIsUpdated(true);
            await gameService.deleteGame(props.gameId);
            props.onDelete();
        }
    };

    const handleUnarchive = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isUpdating) {
            return;
        }
        setIsUpdated(true);
        await gameService.unarchiveGame(props.gameId);
        props.onDelete();
    };

    return (
        <React.Fragment>
            {props.isArchived ? (
                <button
                    className={classNames({
                        loading: isUpdating || props.loading
                    })}
                    onClick={e => handleUnarchive(e)}
                >
                    Unarchive
                </button>
            ) : (
                <button
                    className={classNames('warning', {
                        loading: isUpdating || props.loading
                    })}
                    onClick={e => handleDelete(e)}
                >
                    <span className="icon-bin"></span>
                    Archive
                </button>
            )}
        </React.Fragment>
    );
};
