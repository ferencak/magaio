import React from 'react'
import './style.css'

class Loading extends React.Component {

  render() {
    return (
      <React.Fragment>
        <div className="lds"><div></div><div></div><div></div></div>
      </React.Fragment>
    )
  }

}

export default Loading