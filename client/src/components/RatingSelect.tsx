import React from 'react';
import {
    GameRating,
    ratingArray
} from '@shared/models/game-library-entry.model';

export type RatingSelectProps = {
    rating: GameRating;
    onChange: (rating: GameRating) => void;
};

export const RatingSelect: React.FC<RatingSelectProps> = props => {
    return (
        <select
            onChange={e => props.onChange(parseInt(e.target.value))}
            value={props.rating}
        >
            {ratingArray.map(rating => (
                <option key={rating.value} value={rating.value}>
                    {rating.text}
                </option>
            ))}
        </select>
    );
};
