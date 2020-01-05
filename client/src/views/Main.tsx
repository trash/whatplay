import * as React from 'react';
import {Provider} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {Router, Route, Link, Redirect, Switch} from 'react-router-dom';

import {store} from '../redux/store';
import {auth} from '../services/Auth';
import {history} from '../services/history';

import {ConnectedHomeView} from './Home';
import {CreateUserView} from './CreateUser';
import {ConnectedNotesPageView} from './NotesPage';
import {Callback} from './Callback';
import {TestView} from './Test';
import {ConnectedHeaderView} from './Header';

export class MainView extends React.Component<void, {}> {
    private handleAuthentication(nextState: RouteComponentProps<void>) {
        if (/access_token|id_token|error/.test(nextState.location.hash)) {
            auth.handleAuthentication();
        }
    }

	render () {
		return (
            <Provider store={store}>
                <Router history={history}>
                    <div>
                        <ConnectedHeaderView/>
                        <div className="maxWidth">
                            <Route exact path="/" component={ConnectedHomeView}/>
                            <Route path="/user" component={CreateUserView}/>
                            <Route path="/notes" component={ConnectedNotesPageView}/>
                            <Route
                                path="/callback"
                                render={(props: RouteComponentProps<void>) => {
                                    this.handleAuthentication(props);
                                    return <Callback {...props} />
                                }}
                            />
                        </div>
                    </div>
                </Router>
            </Provider>
		);
	}
}