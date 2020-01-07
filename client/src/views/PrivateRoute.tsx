// src/components/PrivateRoute.js

import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useAuth0 } from '../services/ReactAuth';

function RedirectIfNotLoggedInComponent(props: { path: string }) {
    const { loading, isAuthenticated, loginWithRedirect } = useAuth0();
    useEffect(() => {
        if (loading || isAuthenticated) {
            return;
        }
        const fn = async () => {
            await loginWithRedirect({
                appState: { targetUrl: props.path }
            });
        };
        fn();
    }, [loading, isAuthenticated, loginWithRedirect, props.path]);
    return null;
}

export const PrivateRoute = ({ component: Component, path, ...rest }) => {
    const { loading, isAuthenticated } = useAuth0();
    const render = props =>
        isAuthenticated === true ? (
            <Component {...props} />
        ) : (
            <RedirectIfNotLoggedInComponent path={path} />
        );

    return <Route path={path} render={render} {...rest} />;
};
