import React from 'react';
import { useLocation } from 'react-router-dom';

export function NoMatch() {
    const location = useLocation();
    return (
        <section className="maxWidth">
            <h1>
                404: No match for <code>{location.pathname}</code>
            </h1>
            <div className="quoteImage">
                <img
                    src="/images/fargothalypse.png"
                    style={{ width: '100%' }}
                />
                <p>"Go back where you came from, Fetcher!" - Fargoth</p>
            </div>
        </section>
    );
}
