import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM from 'react-dom/client'
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);






