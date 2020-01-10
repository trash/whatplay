import React, { useState, FormEvent } from 'react';
import { gameService } from '../services/GameService';
import { GameStub } from '@shared/models/game.model';

type CreateGameProps = {};

export const CreateGame: React.FC<CreateGameProps> = () => {
    const [game, setGame] = useState<GameStub>({
        title: '<Game Title>',
        systems: [],
        genres: [],
        timeToBeat: 0
    });
    function updateGameProperty<T extends keyof GameStub>(
        gameToUpdate: GameStub,
        property: T,
        value: GameStub[T]
    ): void {
        const clone = Object.assign({}, gameToUpdate);
        clone[property] = value;
        setGame(clone);
    }
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        console.log(game);
        const created = await gameService.createGame(game);
        console.log(created);
    };
    return (
        <form onSubmit={handleSubmit}>
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

            <button>Submit</button>
        </form>
    );
};
