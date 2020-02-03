import React from 'react';

export const NeedToLogin: React.FC = () => {
    return (
        <section className="maxWidth">
            <h1>You need to be logged in to do this</h1>
            <p>
                Create an account by hitting the "Login" button in the top right
                to start contributing to the WhatPlay project!
            </p>
            <p>
                If you want to just keep browsing anonymously that's cool too!
            </p>

            <div className="quoteImage">
                <img
                    style={{
                        maxWidth: '100%',
                        margin: 'auto'
                    }}
                    src="/images/dagoth.png"
                />
                <p>
                    "Strange. This outcome I did not foresee. That you would
                    come unprepared." - Dagoth Ur
                </p>
            </div>
        </section>
    );
};
