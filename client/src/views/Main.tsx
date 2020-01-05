import * as React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';

import { store } from '../redux/store';
import { history } from '../services/history';

import { ConnectedHomeView } from './Home';
import { CreateUserView } from './CreateUser';
import { ConnectedNotesPageView } from './NotesPage';
// import { TestView } from './Test';
import { HeaderView } from './Header';
import { config } from '../config';
import { Auth0Provider, useAuth0 } from '../services/Auth';
import Profile from './Profile';
import { PrivateRoute } from './PrivateRoute';

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
    history.push(
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
};

function MainView() {
    const { loading } = useAuth0();

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <Provider store={store}>
            <Auth0Provider
                domain={config.auth0Domain}
                client_id={config.auth0ClientId}
                redirect_uri={window.location.origin}
                onRedirectCallback={onRedirectCallback}
            >
                <Router history={history}>
                    <div>
                        <HeaderView />
                        <div className="maxWidth">
                            <Route
                                exact
                                path="/"
                                component={ConnectedHomeView}
                            />
                            <Route path="/user" component={CreateUserView} />
                            <Route
                                path="/notes"
                                component={ConnectedNotesPageView}
                            />
                            <PrivateRoute path="/profile" component={Profile} />
                        </div>
                    </div>
                </Router>
            </Auth0Provider>
        </Provider>
    );
}

export default MainView;
