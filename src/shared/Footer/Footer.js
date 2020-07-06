import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowMinimize } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import './style.css'

class Footer extends React.Component {

  render() {
    return (
      <React.Fragment>
        <div className="top-bar">
          <div className="icon-group float-right">
            <FontAwesomeIcon icon={faWindowMinimize} className="icon" style={{top: '-3px', color: '#b3b3b3'}}/>
            <FontAwesomeIcon icon={faTimes} className="icon" style={{color: '#ff6c6c'}}/>
          </div>
        </div>
      </React.Fragment>
    )
  }

}

export default Footer