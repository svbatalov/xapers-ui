import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SearchPanel from './SearchPanel';
import EditPanel from './EditPanel';

export default class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={SearchPanel} />
        <Route path="/:id" component={EditPanel} />
      </Switch>
    );
  }
}
