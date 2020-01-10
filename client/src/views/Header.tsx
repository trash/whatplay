import * as React from 'react';
import { NavLink } from 'react-router-dom';

import { useAuth0 } from '../services/ReactAuth';

export function HeaderView() {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    return (
        <div className="header">
            <div className="header_inner maxWidth">
                <div className="header_brand">
                    <NavLink to="">What To Play Next</NavLink>
                </div>
                <div className="header_navlist">
                    <NavLink
                        className="header_navlist_item"
                        to="/games"
                        activeClassName="selected"
                    >
                        Browse Games
                    </NavLink>
                    {isAuthenticated && (
                        <React.Fragment>
                            <NavLink
                                className="header_navlist_item"
                                to="/library"
                                activeClassName="selected"
                            >
                                My Library
                            </NavLink>
                        </React.Fragment>
                    )}
                </div>
                <button
                    onClick={() =>
                        isAuthenticated ? logout() : loginWithRedirect()
                    }
                >
                    {isAuthenticated ? 'Logout' : 'Login'}
                </button>
            </div>
        </div>
    );
}
