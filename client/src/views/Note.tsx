import * as React from 'react';
import * as moment from 'moment';
import * as Immutable from 'immutable';
import * as classnames from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';


import {Note} from '../models/note';
import {noteService} from '../services/NoteService';

type NotesViewProps = {
    note: Note;
}

type NoteViewState = {
    isEditing: boolean;
    editedNote: string;
}

export class NoteView extends React.Component<NotesViewProps, NoteViewState> {
    constructor(props) {
        super(props);
        this.state = {
            editedNote: '',
            isEditing: false
        };
    }

    private toggleEditing(): void {
        const currentlyEditing = this.state.isEditing;
        this.setState({
            isEditing: !currentlyEditing
        });
        if (!currentlyEditing) {
            this.setState({
                editedNote: this.props.note.note
            });
        }
    }

    private autoResizeTextArea

    private inputOnChange(e: React.ChangeEvent<any>): void {
        this.setState({
            editedNote: e.target.value
        });
    }

    private onEditSubmit(): void {
        // Update if there was an actual change
        if (this.state.editedNote !== this.props.note.note) {
            noteService.updateNote(this.props.note.id, this.state.editedNote);
        }
        this.toggleEditing();
    }

    private renderEditingView(): JSX.Element {
        return (
            <div className="notesList_note_edit">
                <TextareaAutosize
                    value={this.state.editedNote}
                    onChange={e => this.inputOnChange(e)}
                />
                <button
                    className="primary"
                    type="submit"
                    onClick={() => this.onEditSubmit()}
                >
                    Save Changes
                </button>
            </div>
        );
    }

    private onDelete(id: number): void {
        if (window.confirm('Are you sure you would like to delete this note?')) {
            noteService.deleteNote(id);
        }
    }

     render() {
        const note = this.props.note;
        return (
            <div className="notesList_note" key={note.id}>
                <div className="notesList_note_header">
                    { false && <span className="notesList_note_id">
                        {note.id}
                    </span> }
                    <span className="notesList_note_timestamp">
                        {note.date.format('MM/DD/YYYY')}
                    </span>
                    <div className="notesList_note_controls">
                        <button
                            className={classnames('notesList_note_edit', {
                                active: this.state.isEditing
                            })}
                            onClick={() => this.toggleEditing()}
                        >
                            <i className="fa fa-edit"></i>
                        </button>
                        <button
                            className="notesList_note_delete"
                            onClick={() => this.onDelete(note.id)}
                        >
                            <i className="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div className="notesList_note_body">
                    {this.state.isEditing
                        ? this.renderEditingView()
                        : <span>{note.note}</span>
                    }
                </div>
            </div>
        );
    }
}