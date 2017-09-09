import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';
import './styles/index.scss';
// import 'bootstrap/dist/css/bootstrap.css';
import 'whatwg-fetch'; // polyfill

import Store from './store';

const store = new Store();

// FIXME
window.store = store;

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store} >
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) { module.hot.accept() }
