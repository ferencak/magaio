import React from "react";

import {
  Switch,
  Route
} from "react-router-dom";

import Startup from './components/Startup'
import dashboard from './components/Dashboard/Dashboard'

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={Startup} />
        <Route path="/dashboard" component={Startup} />
      </Switch>
    )
  }
}

export default Routes