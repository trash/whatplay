import * as React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';

import {auth} from '../services/Auth';
import {store, StoreState} from '../redux/store';


export type HeaderViewProps = {
    isAuthenticated: boolean;
}

export class HeaderView extends React.Component<HeaderViewProps, {}> {
    toggleLogin(): void {
        if (this.props.isAuthenticated) {
            auth.logout();
        } else {
            auth.login();
        }
    }

    render() {
        return (
        <div className="header">
            <div className="header_inner maxWidth">
                <div className="header_brand">
                    <NavLink
                        to=""
                    >
                        YearInReview
                    </NavLink>
                </div>
                <div className="header_navlist">
                    <NavLink
                        className="header_navlist_item"
                        to="/notes"
                        activeClassName="selected"
                    >
                        Notes
                    </NavLink>
                </div>
                <button onClick={() => this.toggleLogin()}>
                    {this.props.isAuthenticated
                        ? 'Logout'
                        : 'Login'
                    }
                </button>
            </div>
        </div>
        );
    }
}

export const ConnectedHeaderView = connect((state: StoreState) => {
    return {
        isAuthenticated: state.isAuthenticated
    };
})(HeaderView);