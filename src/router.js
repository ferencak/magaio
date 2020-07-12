import React from "react";

import {
  Switch,
  Route
} from "react-router-dom";

import Startup from './components/Startup'
import Dashboard from './components/Dashboard/Dashboard'
import Auth from './components/Auth/Auth'

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={Startup} />
        <Route path="/auth" component={Auth} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    )
  }
}

export default Routes