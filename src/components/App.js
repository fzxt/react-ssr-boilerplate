import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import loadable from '@loadable/component';

import Head from './Head';

function LoadingComponent() {
  return <div>Loading...</div>;
}
const LoadableHome = loadable(() => import('./Home'), {
  fallback: LoadingComponent
});

const LoadableAbout = loadable(() => import('./about/About'), {
  fallback: LoadingComponent
});

const App = () => (
  <div className="app">
    <Head />

    <nav aria-label="main navigation">
      <NavLink exact to="/" activeClassName="active">
        Home
      </NavLink>{' '}
      <NavLink exact to="/about" activeClassName="active">
        About
      </NavLink>
    </nav>

    <main className="main">
      <Switch>
        <Route exact path="/" component={LoadableHome} />
        <Route path="/about" component={LoadableAbout} />
      </Switch>
    </main>

    <footer />
  </div>
);

export default App;
