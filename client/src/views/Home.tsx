import * as React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../redux/store';

interface HomeViewProps {}

type HomeViewState = {};

export class HomeView extends React.Component<HomeViewProps, HomeViewState> {
    constructor(props: HomeViewProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <section>
                <h1>Home Screen</h1>
            </section>
        );
    }
}

export const ConnectedHomeView = connect((_state: StoreState) => {
    return {};
})(HomeView);
