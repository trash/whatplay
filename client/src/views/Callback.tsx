import * as React from 'react';
import {RouteComponentProps} from 'react-router';

export class Callback extends React.Component<RouteComponentProps<void>, {}> {
    render() {
        return (
            <div>
                <h1>Loading</h1>
            </div>
        );
    }
}