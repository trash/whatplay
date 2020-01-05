import * as auth0 from 'auth0-js';

import { history } from './history';
import { store } from '../redux/store';
import { login, logout } from '../redux/actions';
import { config } from '../config';

const redirectUri = `${window.location.origin}/callback`;

export class Auth {
    auth0 = new auth0.WebAuth({
        domain: config.auth0Domain,
        clientID: 'RQ0DxPvvFGtxFHkwdY79jgUPUjfYVb1o',
        redirectUri: redirectUri,
        audience: `${window.location.origin}/api`,
        responseType: 'token id_token',
        scope: 'openid'
    });

    static expiresAtKey = 'expires_at';
    static accessTokenKey = 'access_token';
    static idTokenKey = 'id_token';

    static redirectLocation = '/';

    private setSession(authResult: auth0.Auth0DecodedHash) {
        console.log(authResult);
        // Set the time that the access token will expire at
        const expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        );
        localStorage.setItem(Auth.accessTokenKey, authResult.accessToken);
        localStorage.setItem(Auth.idTokenKey, authResult.idToken);
        localStorage.setItem(Auth.expiresAtKey, expiresAt);
        // navigate to the home route
        history.replace(Auth.redirectLocation);
        // Update redux
        store.dispatch(login());
    }

    handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken) {
                this.setSession(authResult);
                history.replace(Auth.redirectLocation);
            } else if (err) {
                history.replace(Auth.redirectLocation);
                console.log(err);
            }
        });
    }

    login() {
        this.auth0.authorize();
    }

    logout() {
        // Clear access token and expiration from local storage
        localStorage.removeItem(Auth.accessTokenKey);
        localStorage.removeItem(Auth.idTokenKey);
        localStorage.removeItem(Auth.expiresAtKey);
        // Update redux
        store.dispatch(logout());
        // navigate to the home route
        history.replace(Auth.redirectLocation);
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        const expiresAt = JSON.parse(localStorage.getItem(Auth.expiresAtKey));
        console.log('expiredAt', expiresAt);
        return new Date().getTime() < expiresAt;
    }
}

export const auth = new Auth();

if (auth.isAuthenticated()) {
    store.dispatch(login());
}
