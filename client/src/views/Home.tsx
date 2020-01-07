import * as React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../redux/store';
import { Note } from '../models/note';
import { noteService } from '../services/NoteService';

import { NoteView } from './Note';

interface HomeViewProps {}

type HomeViewState = {
    notes: Note[];
};

export class HomeView extends React.Component<HomeViewProps, HomeViewState> {
    constructor(props: HomeViewProps) {
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

export const ConnectedHomeView = connect((_state: StoreState) => {
    return {};
})(HomeView);
