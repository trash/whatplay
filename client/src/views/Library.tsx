import * as React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../redux/store';
import { useAuth0 } from '../services/ReactAuth';

interface LibraryProps {}

export const LibraryPage: React.FC<LibraryProps> = () => {
    const { user } = useAuth0();
    if (!user) {
        return null;
    }
    return (
        <section>
            <h1>My Library</h1>
            <React.Fragment>
                <img
                    style={{ width: '100px', height: '100px' }}
                    src={user.picture}
                    alt="Profile"
                />

                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <code>{JSON.stringify(user, null, 2)}</code>
            </React.Fragment>
        </section>
    );
};

export const ConnectedLibraryPage = connect((_state: StoreState) => {
    return {};
})(LibraryPage);
