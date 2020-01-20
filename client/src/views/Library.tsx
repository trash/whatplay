import * as React from 'react';
import { connect, useSelector } from 'react-redux';

import { useAuth0 } from '../services/ReactAuth';
import { RootState } from 'typesafe-actions';
import { GameLibraryEntryReferenceClient } from '@shared/models/user.model';
import { List } from 'immutable';
import { userService } from '../services/user.service';
import { HydratedGameLibraryClient } from '../models/user.model';
import { GameUtilities } from '../models/game.util';
import { ToggleGameFromLibraryButton } from '../components/ToggleGameFromLibraryButton';

interface LibraryProps {}

export const LibraryPage: React.FC<LibraryProps> = () => {
    const { user } = useAuth0();
    if (!user) {
        return null;
    }
    const { library, hydratedLibrary: hydratedGameLibrary } = useSelector<
        RootState,
        {
            library: List<GameLibraryEntryReferenceClient>;
            hydratedLibrary: HydratedGameLibraryClient;
        }
    >(state => {
        return {
            library: state.user.gameLibrary,
            hydratedLibrary: state.user.hydratedGameLibrary
        };
    });
    // Fetch all lib games
    React.useEffect(() => {
        userService.getAllLibraryGames(library);
    }, [library]);

    console.log(hydratedGameLibrary);

    if (hydratedGameLibrary === null) {
        return null;
    }

    return (
        <section>
            <h1>Game Library</h1>
            <img
                style={{ width: '100px', height: '100px', display: 'none' }}
                src={user.picture}
                alt="Profile"
            />
            <table className="table">
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Time To Beat</th>
                        <th>Played Status</th>
                        <th>Your Rating</th>
                        <th>Backlog Priority</th>
                        <th style={{ display: 'none' }}>Systems Owned</th>
                        <th style={{ display: 'none' }}>Id</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {hydratedGameLibrary.map(entry => (
                        <tr key={entry?.gameLibraryEntry._id}>
                            <td>{entry?.game.title}</td>
                            <td>{entry?.game.timeToBeat}</td>
                            <td>
                                {GameUtilities.playedStatus(
                                    entry?.gameLibraryEntry.playedStatus!
                                )}
                            </td>
                            <td>{entry?.gameLibraryEntry.rating}</td>
                            <td>{entry?.gameLibraryEntry.backlogPriority}</td>
                            <td style={{ display: 'none' }}>
                                {entry?.gameLibraryEntry.systemsOwned}
                            </td>
                            <td style={{ display: 'none' }}>
                                {entry?.gameLibraryEntry._id}
                            </td>
                            <td>
                                <ToggleGameFromLibraryButton
                                    game={entry?.game!}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export const ConnectedLibraryPage = connect((_state: RootState) => {
    return {};
})(LibraryPage);
