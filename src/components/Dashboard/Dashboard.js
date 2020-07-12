import React from "react"
import './style.css'

import Menu from '../../shared/Menu/Menu'

class Dashboard extends React.Component {

  render() {
    return (
      <React.Fragment>
        <Menu active="dashboard"/>
        <div className="route-content">
          <div className="route-tools">
            <p className="label">Actions</p>
            <p className="tools-label">Create</p>
            <p className="tools-label">Run all</p>
            <p className="tools-label">Mass edit</p>
            <p className="tools-label" style={{background: 'rgba(171, 56, 56, 0.28)', color: 'rgba(255, 89, 89, 0.5)'}}>Remove all</p>
          </div>
          <div className="tasks">
            <div className="box">
              <div className="image">
                <img src="https://i.ya-webdesign.com/images/jordan-transparent-mid-7.webp" />
              </div>
              <p className="name">AJ 1 MID</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

}

export default Dashboard