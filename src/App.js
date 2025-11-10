import React from 'react';
import './App.css';
import Web from './components/web';
import NoMatch from './components/nomatch';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Switch>
              <Route path='/' component={Web} />
              <Route component={NoMatch} />
            </Switch>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </Provider>
  );
}

export default App;
