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
};

export const DeleteGameButton: React.FC<DeleteGameButtonProps> = props => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
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
        if (isDeleting) {
            return;
        }
        if (window.confirm('Are you sure you want to delete this game?')) {
            setIsDeleting(true);
            await gameService.deleteGame(props.gameId);
            props.onDelete();
        }
    };
    return (
        <button
            className={classNames('warning', {
                loading: isDeleting || props.loading
            })}
            onClick={e => handleDelete(e)}
        >
            <span className="icon-bin"></span>
            Delete
        </button>
    );
};
