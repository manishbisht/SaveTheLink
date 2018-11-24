import React from 'react';
import ReactDOM from 'react-dom';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import registerServiceWorker from './registerServiceWorker';

import './css/index.css';
import App from './components/App';

ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}><App /></MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();