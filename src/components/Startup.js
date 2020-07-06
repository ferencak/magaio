import React from 'react'
import * as Diskdb from 'diskdb'
import * as hwid from 'hwid'

import Auth from './Auth/Auth'
import Dashboard from './Dashboard/Dashboard'
import Loading from '../shared/Loading/Loading'
import TopBar from '../shared/TopBar/TopBar'

class Startup extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      canLoad: false,
      database: Diskdb.connect('/@mag/local', ['application', 'config']),
      isAuthorized: false, 
    }
  }

  async componentDidMount() {
    let config = this.state.database.config.find()
    
    let hwidKey = hwid.getHWID()

    if (config.length > 0 && config[0].license != null) {
      fetch(`http://89.203.248.241/api/index.php?event=check_license&license=${config[0].license}&hwid=${hwidKey}`)
        .then(res => res.json())
        .then(json => {
          console.log(json)
          if(json.status = 'success') {
            setTimeout(() => {
              this.setState({isAuthorized: true, canLoad: true})
            }, 1200)
          } else {
            this.state.database.application.remove()
            setTimeout(() => {
              this.setState({isAuthorized: false, canLoad: true})
            }, 1200)
          }
        })
    } else {
      setTimeout(() => {
        this.setState({isAuthorized: false, canLoad: true})
      }, 1200)
    }
  }  

  render() {
    if (this.state.canLoad) {
      return (
        <React.Fragment>
          <div className="app-content">
            <TopBar/>
            { this.state.isAuthorized ? <Dashboard/> : <Auth/> }
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <div className="app-content">
            <Loading/>
          </div>
        </React.Fragment>
      )
    }
  }
}

export default Startup
