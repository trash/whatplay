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
import { Auth0Provider, useAuth0 } from '../services/ReactAuth';
import Profile from './Profile';
import { PrivateRoute } from './PrivateRoute';

function MainView() {
    const { loading } = useAuth0();

    // Right now this is kind of heavy handed but it makes stuff
    // a little easier because the Api service is not written
    // right now to handle the time when the auth0 client isn't loaded.
    // It should be...someday.
    if (loading) {
        return null;
    }
    return (
        <Router history={history}>
            <HeaderView />
            <div className="maxWidth">
                <Route exact path="/" component={ConnectedHomeView} />
                <Route path="/user" component={CreateUserView} />
                <Route path="/notes" component={ConnectedNotesPageView} />
                <PrivateRoute path="/profile" component={Profile} />
            </div>
        </Router>
    );
}

export default MainView;
