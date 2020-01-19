import * as React from 'react';
import { connect, useSelector } from 'react-redux';

import { useAuth0 } from '../services/ReactAuth';
import { RootState } from 'typesafe-actions';
import { GameLibraryEntryReferenceClient } from '@shared/models/user.model';
import { List } from 'immutable';

interface LibraryProps {}

export const LibraryPage: React.FC<LibraryProps> = () => {
    const { user } = useAuth0();
    if (!user) {
        return null;
    }
    const { library } = useSelector<
        RootState,
        {
            library: List<GameLibraryEntryReferenceClient>;
        }
    >(state => {
        return {
            library: state.user.gameLibrary
        };
    });
    console.info(user, library);
    return (
        <section>
            <h1>Game Library</h1>
            <img
                style={{ width: '100px', height: '100px', display: 'none' }}
                src={user.picture}
                alt="Profile"
            />
            {library.map(entry => (
                <div>
                    <div>Game Id:{entry?.gameId}</div>
                    <div>Game Library Entry Id:{entry?.gameLibraryEntryId}</div>
                </div>
            ))}
        </section>
    );
};

export const ConnectedLibraryPage = connect((_state: RootState) => {
    return {};
})(LibraryPage);
