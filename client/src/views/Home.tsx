import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { Route, RouteComponentProps } from 'react-router';
import { History } from 'history';
import * as classNames from 'classnames';

import { store, StoreState } from '../redux/store';
import { Note } from '../models/note';
import { noteService } from '../services/NoteService';

import { NoteView } from './Note';

interface HomeViewProps {}

type HomeViewState = {
    notes: Note[];
};

export class HomeView extends React.Component<
    RouteComponentProps<HomeViewProps>,
    HomeViewState
> {
    constructor(props) {
        super(props);
        this.state = {
            notes: []
        };
    }

    async componentWillMount() {
        const notes = await noteService.getNotesForWeek(1);
        console.log(notes);
        this.setState({
            notes
        });
    }

    render() {
        return (
            <section>
                <h1>Notes For This Week</h1>
                <div className="notesList">
                    {this.state.notes
                        .sort((a, b) => b.date.valueOf() - a.date.valueOf())
                        .map(note => {
                            return <NoteView key={note.id} note={note} />;
                        })}
                </div>
            </section>
        );
    }
}

export const ConnectedHomeView = connect((state: StoreState) => {
    return {};
})(HomeView);
