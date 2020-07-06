import React from "react";

import {
  Switch,
  Route
} from "react-router-dom";

import Startup from './components/Startup'

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={Startup} />
      </Switch>
    )
  }
}

export default Routes