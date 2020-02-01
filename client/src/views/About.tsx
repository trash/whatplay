import * as React from 'react';

export const AboutPage: React.FC = () => {
    return (
        <section>
            <h1>Welcome to the WhatPlay alpha!</h1>
            <h3>What is it?</h3>
            <p>
                WhatPlay in short is meant to be{' '}
                <a href="https://www.goodreads.com/">Goodreads</a> for games. A
                place to store a <b>catalog of all the games you've played</b>{' '}
                and what you thought of them. It's also a place to{' '}
                <b>keep track of all the games you want to play</b>. Finally,
                and perhaps most importantly, using the data from all the
                people's ratings of games we're going to build a{' '}
                <b>recommendation algorithm</b> that recommends novel and
                interesting new games based off of the ones you enjoyed the
                most.
            </p>
            <h3>We need your help!</h3>
            <p>
                We need your help because in order to build the recommendation
                algorithm we need lots and lots of data on people's particular
                tastes in videogames. The more people we get to add ratings for
                all the games they've played to our database the better the
                results of the algorithm can be.
            </p>
            <p>
                To help out all you need to do is a create an account (it's
                free) and start adding ratings for all the games you've
                completed.
            </p>
            <p>
                While you're at it you can use WhatPlay to organize your game
                collection. Let us know what we can do to improve it and make it
                more useful to you.
            </p>
            <h3>Why did you start building this, anyway?</h3>
            <p>
                We started building WhatPlay because we couldn't find any place
                to get really good personalized recommendations for games. We
                could either reach out to friends or read reviews on sites but
                those aren't really personalized to your particular taste. There
                are some algorithmic recommendations like Steam's for example
                but we found that those always just recommended either whatever
                was new or was the flavor of the month. For instance, one of our
                founders top recommendation from Steam was TemTem even though
                they haven't played any games similar to that (and don't really
                want to).
            </p>

            <p>
                WhatPlay is in Beta and is under very active development so all
                of this is subject to change. In fact, we're always looking for
                feedback, so if you want to let us know what we should build
                next, reach out to us!
            </p>
            <p>
                <a href="mailto:feedback@whatplay.io">feedback@whatplay.io</a>
            </p>
        </section>
    );
};
