import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MainView from './views/Main';
import { history } from './services/history';
import { Auth0Provider, useAuth0 } from './services/ReactAuth';
import { Provider } from 'react-redux';

// import css for webpack
import '../less/main.less';
import { config } from './config';
import { store } from './redux/store';

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
    history.push(
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
};

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Provider store={store}>
            <Auth0Provider
                domain={config.auth0Domain}
                audience={config.auth0Audience}
                client_id={config.auth0ClientId}
                redirect_uri={window.location.origin}
                onRedirectCallback={onRedirectCallback}
            >
                <MainView />
            </Auth0Provider>
        </Provider>,
        document.querySelector('#root')
    );
});
