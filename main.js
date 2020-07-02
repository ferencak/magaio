'use strict'

const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const diskdb = require('diskdb')
const fs = require('fs')

if (!fs.existsSync('/mag/db')) {
  fs.mkdirSync('/mag')
  fs.mkdirSync('/mag/db')
}

let mainWindow = null, 
    dev = false, 
    db = diskdb.connect('/mag/db', ['application']);

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  dev = true
}

if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

function start() {
  let config = db.application.find()

  if (config.length == 0) 
    db.application.save({license: null})
  
  if (config.length > 0 && config[0].license_key != null) {
    // TODO: Check if license is valid
    // Application window
    if (mainWindow === null)
      createWindow(950, 650)

  } else {
    // Login window
    if (mainWindow === null)
    createWindow(320, 360)

  }
  
}

function createWindow(width, height) {
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  let indexPath

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

app.on('ready', start)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    start()
  }
})


