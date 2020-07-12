import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

import './style.css'

class TopBar extends React.Component {

  render() {
    return (
      <React.Fragment>
        <div className="top-bar">
          <p className="top-bar-title">
            <span className="title">MAG AIO</span>
            <span className="title-ver">v 1.0</span>
          </p>

          <div className="icon-group float-right">
            <FontAwesomeIcon icon={faCircle} className="icon minimize"/>
            <FontAwesomeIcon icon={faCircle} className="icon maximize"/>
          </div>
        </div>
      </React.Fragment>
    )
  }

}

export default TopBar