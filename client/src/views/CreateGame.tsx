import React, { useState, FormEvent } from 'react';
import { GameStub, Game } from '@shared/models/game.model';
import { genres, systems } from '../constants';

type CreateGameProps<T extends GameStub> = {
    initialGameState: T;
    onSubmit: (event: FormEvent, game: T) => Promise<Game>;
    titleText: string;
    submitButtonText: string;
};

function updateGamePropertyGenerator<T extends GameStub>(
    setGame: React.Dispatch<React.SetStateAction<T>>
) {
    return <K extends keyof T>(gameToUpdate: T, property: K, value: T[K]) => {
        const clone = Object.assign({} as T, gameToUpdate);
        clone[property] = value;
        setGame(clone);
    };
}

export const CreateGame: <T extends GameStub>(
    props: CreateGameProps<T>
) => React.ReactElement<CreateGameProps<T>> = props => {
    const [game, setGame] = useState(props.initialGameState);
    const updateGameProperty = updateGamePropertyGenerator(setGame);
    return (
        <form onSubmit={e => props.onSubmit(e, game)}>
            <div className="form_title">{props.titleText}</div>
            <div>
                <label>
                    Title
                    <input
                        type="text"
                        value={game.title}
                        onChange={e =>
                            updateGameProperty(game, 'title', e.target.value)
                        }
                    />
                </label>
            </div>
            <div>
                <label>
                    Time To Beat
                    <input
                        type="number"
                        value={game.timeToBeat}
                        onChange={e =>
                            updateGameProperty(
                                game,
                                'timeToBeat',
                                parseFloat(e.target.value)
                            )
                        }
                    />
                </label>
            </div>
            <div>
                <label>
                    Genre(s)
                    <select
                        multiple
                        value={game.genres}
                        onChange={e =>
                            updateGameProperty(
                                game,
                                'genres',
                                Array.from(e.target.selectedOptions).map(
                                    o => o.value
                                )
                            )
                        }
                    >
                        {genres.map(g => (
                            <option key={g}>{g}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    System(s)
                    <select
                        multiple
                        value={game.systems}
                        onChange={e =>
                            updateGameProperty(
                                game,
                                'systems',
                                Array.from(e.target.selectedOptions).map(
                                    o => o.value
                                )
                            )
                        }
                    >
                        {systems.map(s => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                </label>
            </div>

            <button className="primary">{props.submitButtonText}</button>
        </form>
    );
};
