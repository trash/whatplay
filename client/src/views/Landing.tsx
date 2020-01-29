import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';

interface HomeViewProps {}

type HomeViewState = {};

export class LandingPage extends React.Component<HomeViewProps, HomeViewState> {
    constructor(props: HomeViewProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <section>
                <h1>Landing Page</h1>
                <p>I really need to write some content to go here.</p>
                <p>I really need to write some content to go here.</p>
                <p>I really need to write some content to go here.</p>
                <p>I really need to write some content to go here.</p>
                <p>I really need to write some content to go here.</p>
                <p>I really need to write some content to go here.</p>
                <p>I really need to write some content to go here.</p>
                <p>I really need to write some content to go here.</p>
            </section>
        );
    }
}

export const ConnectedHomeView = connect((_state: RootState) => {
    return {};
})(LandingPage);
