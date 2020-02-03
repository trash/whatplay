import * as React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { history } from '../services/history';

import { GamesPageView } from './GamesPage';
// import { TestView } from './Test';
import { HeaderView } from './Header';
import { useAuth0 } from '../services/ReactAuth';
import { ConnectedLibraryPage } from './Library';
import { AboutPage } from './About';
import { NoMatch } from './NoMatch';

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
                <Switch>
                    <Route exact path="/" component={GamesPageView} />
                    <Route exact path="/about" component={AboutPage} />
                    <Route
                        path="/library/:userId"
                        component={ConnectedLibraryPage}
                    />
                    <Route path="*">
                        <NoMatch />
                    </Route>
                </Switch>
            </div>
            <footer>
                <div>Welcome to the WhatPlay alpha!</div>
                <div>
                    Got feedback?{' '}
                    <a href="mailto:feedback@whatplay.io">Contact Us</a>
                </div>
                <div>
                    <a href="https://mailchi.mp/2da2bb5f6559/whatplay">
                        Stay up to date
                    </a>
                </div>
            </footer>
        </Router>
    );
}

export default MainView;
