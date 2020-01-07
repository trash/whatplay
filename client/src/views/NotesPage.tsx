import * as React from 'react';
import { connect } from 'react-redux';
import * as Immutable from 'immutable';

import { Note } from '../models/note';
import { noteService } from '../services/NoteService';
import { StoreState } from '../redux/store';

import { CreateNoteView } from './CreateNote';
import { NoteView } from './Note';

type NotesPageViewProps = {
    notes: Immutable.List<Note>;
};

type NotePageViewState = {};

export class GamesPageView extends React.Component<
    NotesPageViewProps,
    NotePageViewState
> {
    constructor(props: NotesPageViewProps) {
        super(props);
        this.state = {
            notes: []
        };
        noteService.refetchAllNotes(1);
    }

    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <CreateNoteView />
                <div className="notesList">
                    {this.props.notes
                        .sort((a, b) => b.date.valueOf() - a.date.valueOf())
                        .map(note => {
                            return <NoteView key={note!.id} note={note!} />;
                        })}
                </div>
            </div>
        );
    }
}

export const ConnectedGamesPageView = connect((state: StoreState) => {
    return {
        notes: state.notes
    };
})(GamesPageView);
