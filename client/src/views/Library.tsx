import * as React from 'react';
import { connect } from 'react-redux';

import { useAuth0 } from '../services/ReactAuth';
import { RootState } from 'typesafe-actions';

interface LibraryProps {}

export const LibraryPage: React.FC<LibraryProps> = () => {
    const { user } = useAuth0();
    if (!user) {
        return null;
    }
    console.info(user);
    return (
        <section>
            <h1>My Library</h1>
            <React.Fragment>
                <img
                    style={{ width: '100px', height: '100px' }}
                    src={user.picture}
                    alt="Profile"
                />

                <h2>Name: {user.name}</h2>
                <p>Admin: {user.isAdmin + ''}</p>
                <p>Auth0 Id: {user.auth0Id}</p>
                <p>Id: {user.id}</p>
                <p>Last Updated (Auth0) {user.updatedAt.format('LLL')}</p>
            </React.Fragment>
        </section>
    );
};

export const ConnectedLibraryPage = connect((_state: RootState) => {
    return {};
})(LibraryPage);
