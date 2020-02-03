import React from 'react';
import { useLocation } from 'react-router-dom';

export function NoMatch() {
    const location = useLocation();
    return (
        <div>
            <h1>
                404: No match for <code>{location.pathname}</code>
            </h1>
            <h3>"Go back where you came from, Fetcher!" - Fargoth</h3>
            <img src="/images/fargothalypse.png" style={{ width: '100%' }} />
        </div>
    );
}
