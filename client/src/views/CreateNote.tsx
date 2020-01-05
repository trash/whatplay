import * as React from 'react';
import * as moment from 'moment';
import TextareaAutosize from 'react-autosize-textarea';

import {noteService} from '../services/NoteService';
import {DatePeriod} from '../models/enums';

type CreateNoteViewProps = {

}

type CreateNoteViewState = {
    userId: number;
    note: string;
}



export class CreateNoteView extends React.Component<CreateNoteViewProps, CreateNoteViewState> {
    constructor(props) {
        super(props);
        this.state = {
            userId: 1,
            note: ''
        };
    }

    noteOnChange(event: React.ChangeEvent<any>): void {
        this.setState({
            note: event.target.value
        });
    }

    async createUser(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const note = await noteService.createNote(
            this.state.userId,
            this.state.note,
            DatePeriod.Day
        );
        this.setState({
            note: ''
        });
    }

    render() {
        return (
            <form onSubmit={(event) => this.createUser(event)}>
                <div className="notesList_note notesList_note--newNote">
                    <div className="notesList_note_header">
                        <p className="notesList_note_title">
                            New Note
                        </p>
                        <span className="notesList_note_timestamp">
                            {moment().format('MM/DD/YYYY')}
                        </span>
                    </div>
                    <div className="notesList_note_body">
                        <TextareaAutosize
                            name="note"
                            value={this.state.note}
                            onChange={e => this.noteOnChange(e)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="primary"
                    >
                        Submit
                    </button>
                </div>
            </form>
        );
    }
}