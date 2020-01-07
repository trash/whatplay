// src/react-auth0-spa.js
import React, { useState, useEffect, useContext } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { config } from '../config';

// Do a little BS here to expose our Auth0 client outside react
export let auth0: Auth0Client;
const configureClient = async () => {
    auth0 = await createAuth0Client({
        domain: config.auth0Domain,
        audience: config.auth0Audience,
        client_id: config.auth0ClientId,
        redirect_uri: window.location.origin
    });
};
const configureClientPromise = configureClient();

// Everything below here is basically copy pasted from Auth0's
// React guide. It provides hooks for react components for the
// auth0 client flow. I changed a couple commented lines to
// use the globally exposed auth0 client I created above.
export interface Auth0User extends Omit<IdToken, '__raw'> {}

interface Auth0Context {
    user?: Auth0User;
    isAuthenticated: boolean;
    popupOpen: boolean;
    loading: boolean;
    loginWithPopup(o?: PopupLoginOptions): Promise<void>;
    handleRedirectCallback(): Promise<RedirectLoginResult>;
    getIdTokenClaims(o?: getIdTokenClaimsOptions): Promise<IdToken>;
    loginWithRedirect(o?: RedirectLoginOptions): Promise<void>;
    getTokenSilently(o?: GetTokenSilentlyOptions): Promise<string | undefined>;
    getTokenWithPopup(
        o?: GetTokenWithPopupOptions
    ): Promise<string | undefined>;
    logout(o?: LogoutOptions): void;
}

type Auth0ProviderOptions = {
    audience: string;
    domain: string;
    client_id: string;
    redirect_uri: string;
};

const DEFAULT_REDIRECT_CALLBACK = (appState: Auth0ProviderOptions) =>
    window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext<Auth0Context>({} as any);
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
    children,
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    ...initOptions
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [user, setUser] = useState();
    const [auth0Client, setAuth0] = useState();
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        const initAuth0 = async () => {
            // These two lines are my hack to get the Auth0 react code
            // to play with my globally exposed auth0 client
            await configureClientPromise;
            const auth0FromHook = auth0;

            setAuth0(auth0FromHook);

            if (window.location.search.includes('code=')) {
                const {
                    appState
                } = await auth0FromHook.handleRedirectCallback();
                onRedirectCallback(appState);
            }

            const isAuthenticated = await auth0FromHook.isAuthenticated();

            setIsAuthenticated(isAuthenticated);

            if (isAuthenticated) {
                const user = await auth0FromHook.getUser();
                setUser(user);
            }

            setLoading(false);
        };
        initAuth0();
        // eslint-disable-next-line
    }, []);

    const loginWithPopup = async (params = {}) => {
        setPopupOpen(true);
        try {
            await auth0Client.loginWithPopup(params);
        } catch (error) {
            console.error(error);
        } finally {
            setPopupOpen(false);
        }
        const user = await auth0Client.getUser();
        setUser(user);
        setIsAuthenticated(true);
    };

    const handleRedirectCallback = async () => {
        setLoading(true);
        const result = await auth0Client.handleRedirectCallback();
        const user = await auth0Client.getUser();
        setLoading(false);
        setIsAuthenticated(true);
        setUser(user);
        return result;
    };
    return (
        <Auth0Context.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                popupOpen,
                loginWithPopup,
                handleRedirectCallback,
                getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
                loginWithRedirect: (...p) =>
                    auth0Client.loginWithRedirect(...p),
                getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
                getTokenWithPopup: (...p) =>
                    auth0Client.getTokenWithPopup(...p),
                logout: (...p) => auth0Client.logout(...p)
            }}
        >
            {children}
        </Auth0Context.Provider>
    );
};
