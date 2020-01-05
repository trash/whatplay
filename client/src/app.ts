import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MainView from './views/Main';

// import css for webpack
import '../less/main.less';

const MainViewComponent = React.createFactory(MainView);

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(MainViewComponent(), document.querySelector('#root'));
});
