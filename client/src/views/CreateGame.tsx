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

    const genres = [
        'JRPG',
        'Action',
        'Action RPG',
        'Adventure',
        'RPG',
        'Open World',
        'Shooter',
        'VR',
        'MMO',
        'Simulation',
        'Rhythm',
        'Strategy RPG',
        'Base Builder',
        'Stealth',
        'Roguelike',
        'Puzzle',
        'Survival',
        'Horror',
        'TCG',
        'Crafting',
        'Sidescroller',
        'Platformer',
        'Strategy'
    ].sort();
    const systems = [
        'PlayStation',
        'PlayStation 2',
        'PlayStation 3',
        'PlayStation 4',
        'Xbox',
        'Xbox 360',
        'Xbox One',
        'PC',
        'Nintendo Switch',
        'Nintendo 3DS',
        'Nintendo DS',
        'PSP',
        'PS Vita',
        'Game Boy Advance',
        'Nintendo 64',
        'Nintendo GameCube',
        'Wii',
        'Wii U',
        'Sega Dreamcast',
        'Sega Genesis',
        'Sega Saturn',
        'NES',
        'SNES'
    ].sort();

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

            <button className="primary">Submit</button>
        </form>
    );
};
