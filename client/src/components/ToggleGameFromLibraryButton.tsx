import React from 'react';
import classNames from 'classnames';
import { userService } from '../services/user.service';
import { Game } from '../models/game.model';
import { useAuth0 } from '../services/ReactAuth';

type Props = {
    game: Game;
    loading?: boolean;
    shortText?: boolean;
};

const getText = (hasGameInLibrary: boolean, shortText = false): string => {
    if (!hasGameInLibrary) {
        return shortText ? 'Add' : 'Add to Library';
    } else {
        return shortText ? 'Remove' : 'Remove from Library';
    }
};

export const ToggleGameFromLibraryButton: React.FC<Props> = props => {
    const { user } = useAuth0();
    let hasGameInLibrary = false;
    if (user) {
        hasGameInLibrary = userService.hasGameInLibrary(props.game);
    }
    const toggleGameFromLibrary = (game: Game) => {
        return userService.toggleGameFromLibrary(game);
    };
    return (
        <button
            className={classNames({
                loading: props.loading,
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
            {getText(hasGameInLibrary, props.shortText)}
        </button>
    );
};
