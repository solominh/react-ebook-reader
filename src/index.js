import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import PropTypes from 'prop-types'

React.PropTypes=PropTypes

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
