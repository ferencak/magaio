import React from 'react'
import { browserHistory } from 'react-router'
import { useHistory, Redirect } from "react-router-dom";

import './style.css'

class Menu extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      menuItems: [
        'Dashboard', 
        'Proxies', 
        'Accounts',
        'Billing',
        'Settings'
      ]
    }
  }

  redirectTo(route) {
    return <Redirect to='/auth' />
  }

  render() {
    let menu = []
    this.state.menuItems.map((item, index) => {
      menu.push(
        <p key={index} 
          className={ (this.props.active === item.toLowerCase() ? 'active' : '') } 
          style={ (this.state.menuItems.length - 1 === index) ? {marginRight: '0px'} : null } 
          onClick={() => this.redirectTo(item)}>
          {item}
        </p>
      )
    })
    return (
      <React.Fragment>
        <div className="menu-bar">
          <div className="inner">

            { menu }

          </div>
          <div className="user-menu">
            <img src="http://neor.trendsetterthemes.org/img/sidebar-profile.d57df706.jpg" className="user-avatar" />
            <p className="user-name">Nikolas</p>
            <p className="user-license">Lifetime</p>
          </div>
        </div>
      </React.Fragment>
    )
  }

}

export default Menu