import * as React from 'react';
import { useSelector } from 'react-redux';
import * as Immutable from 'immutable';

// import { noteService } from '../services/NoteService';
import { StoreState } from '../redux/store';

// import { CreateNoteView } from './CreateNote';
// import { NoteView } from './Note';
import { GameView } from './Game';
import { noteService } from '../services/NoteService';
import { Game } from '../models/game';

type GamesPageViewProps = {
    games: Immutable.List<Game>;
};

// type NotePageViewState = {};

let calledOnce = false;

export const GamesPageView2: React.FC<GamesPageViewProps> = () => {
    if (!calledOnce) {
        noteService.refetchAllGames();
        calledOnce = true;
    }
    const { games } = useSelector<StoreState, GamesPageViewProps>(
        (state: StoreState) => {
            return {
                games: state.games
            };
        }
    );
    return (
        <div style={{ marginTop: '10px' }}>
            <div className="notesList">
                {games.map(game => {
                    return <GameView key={game!.id} game={game!} />;
                })}
            </div>
        </div>
    );
};

// export class GamesPageView extends React.Component<
//     GamesPageViewProps,
//     NotePageViewState
// > {
//     constructor(props: GamesPageViewProps) {
//         super(props);
//         this.state = {
//             notes: []
//         };
//         noteService.refetchAllNotes(1);
//     }

//     render() {
//         return (
//             <div style={{ marginTop: '10px' }}>
//                 <CreateNoteView />
//                 <div className="notesList">
//                     {this.props.notes
//                         .sort((a, b) => b.date.valueOf() - a.date.valueOf())
//                         .map(note => {
//                             return <NoteView key={note!.id} note={note!} />;
//                         })}
//                 </div>
//             </div>
//         );
//     }
// }

// export const ConnectedGamesPageView = connect((state: StoreState) => {
//     return {
//         notes: state.games
//     };
// })(GamesPageView);
