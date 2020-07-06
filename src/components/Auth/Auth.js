import React, { Fragment } from "react"
import './style.css'
import * as Diskdb from 'diskdb'
import {DebounceInput} from 'react-debounce-input';
import * as hwid from 'hwid'

const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const path = require('path')
const url = require('url')
const fs = require('fs')

class Auth extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      database: Diskdb.connect('/@mag/local', ['application', 'config']),
      build: null,
      licenseInput: '', 
      buttonVisible: false, 
      inputResized: false, 
      error: false, 
      message: '',
      authorized: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.state.build = this.state.database.application.find()[0].build
    this.signIn = this.signIn.bind(this)
  }

  handleChange(event) {
    this.setState({licenseInput: event.target.value})
    
    if(this.state.licenseInput.length == 36) {
      this.setState({inputResized: true, buttonVisible: true})
    } else {
      this.setState({buttonVisible: false})
      setTimeout(() => {
        this.setState({inputResized: false})
      }, 300)
    }
  }

  async signIn() {
    this.setState({error: false, message: '', authorized: false})

    if(this.state.licenseInput.length < 36)
      return null
    
    let hwidKey = await hwid.getHWID()
    fetch(`http://89.203.248.241/api/index.php?event=is_license_exists&license=${this.state.licenseInput}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          
          fetch(`http://89.203.248.241/api/index.php?event=is_license_used&license=${this.state.licenseInput}`)
            .then(res => res.json())
            .then(async (json) => {
              if(json.status === 'success') {
                var xhr = new XMLHttpRequest()
                xhr.open('GET', `http://89.203.248.241/api/index.php?event=set_license_hwid&license=${this.state.licenseInput}&hwid=${hwidKey}`)
                xhr.send()
                this.done()
              } else {
                fetch(`http://89.203.248.241/api/index.php?event=check_license&license=${this.state.licenseInput}&hwid=${hwidKey}`)
                  .then(res => res.json())
                  .then(json => {
                    console.log('JSON STATUS', json.status)
                    if(json.status === 'success') {
                      this.done()
                    } else {
                      this.setState({error: true, message: 'This license is already used.'})
                    }
                  })
              }
            })
        } else {
          this.setState({error: true, message: 'This license is invalid.'})
        }
      })
  }

  done() {
    console.log('DONEE')
    let db = Diskdb.connect('/@mag/local', ['config'])
    db.config.save({license: this.state.licenseInput})
    setTimeout(() => {
      this.setState({error: false, authorized: true, message: 'Successfully authorized. You will be redirected.'})
      this.loadDashboard()
    }, 1500)
  }

  loadDashboard() {
    let mainWindow = new BrowserWindow({
      width: 950,
      height: 650,
      show: false,
      frame: false,
      transparent: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true, 
      }
    })
  
    let indexPath, 
        dev = false

    if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
      dev = true
    }

    if (dev && process.argv.indexOf('--noDevServer') === -1) {
      indexPath = url.format({
        protocol: 'http:',
        host: 'localhost:8080',
        pathname: 'index.html',
        slashes: true
      })
    } else {
      indexPath = url.format({
        protocol: 'file:',
        pathname: path.join(__dirname, 'dist', 'index.html'),
        slashes: true
      })
    }
  
    mainWindow.loadURL(indexPath)
  
    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
  
      if (dev) {
        const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
  
        installExtension(REACT_DEVELOPER_TOOLS)
          .catch(err => console.log('Error loading React DevTools: ', err))
        mainWindow.webContents.openDevTools()
      }
    })
  
    mainWindow.on('closed', function() {
      mainWindow = null
    })
  }

  render() {
    return (
      <Fragment>
        { this.state.error === true &&
          <div className="alert-error">{this.state.message}</div>
        }
        { this.state.error === false && this.state.authorized === true &&
          <div className="alert-authorized">{this.state.message}</div>
        }
        <h1 className="title">MAG</h1>
        <h1 className="under-title">All In One</h1>
        <p className="input-title">License key</p>
        <DebounceInput style={this.state.licenseInput.length > 35 ? {width: '140px'} : {width: '13.203rem'}} type="text" className="license-input" placeholder="Enter your license key..." spellCheck="false" maxLength={36} onChange={(e) => {this.setState({licenseInput: e.target.value})}}/>
        <button style={this.state.licenseInput.length > 35 ? {visibility: 'visible'} : {visibility: 'hidden'}} className="sign-in-button" onClick={this.signIn}>Sign In</button>
        <p className="app-version">Version: 0.1 Alpha, Build #{this.state.build}</p>
      </Fragment>
    )
  }

}

export default Auth