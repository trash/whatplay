import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MainView as MainViewComponent } from './views/Main';

// import css for webpack
import '../less/main.less';

const MainView = React.createFactory(MainViewComponent);

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(MainView(), document.querySelector('#root'));
});
