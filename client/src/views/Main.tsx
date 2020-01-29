import * as React from 'react';
import { Router, Route } from 'react-router-dom';

import { history } from '../services/history';

import { ConnectedHomeView } from './Landing';
import { GamesPageView } from './GamesPage';
// import { TestView } from './Test';
import { HeaderView } from './Header';
import { useAuth0 } from '../services/ReactAuth';
import { PrivateRoute } from './PrivateRoute';
import { ConnectedLibraryPage } from './Library';

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
                <PrivateRoute
                    path="/library"
                    component={ConnectedLibraryPage}
                />
                <Route path="/games" component={GamesPageView} />
            </div>
            <footer>
                <div>Welcome to the WhatPlay alpha!</div>
                <div>
                    Got feedback?{' '}
                    <a href="mailto:stefan@whatplay.io">Contact Us</a>
                </div>
                <div>Made by Stefan Valentin</div>
            </footer>
        </Router>
    );
}

export default MainView;
