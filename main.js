'use strict'

const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const diskdb = require('diskdb')
const fs = require('fs')
const hwid = require('hwid')
const fetch = require('node-fetch');

if (!fs.existsSync('/@mag')) {
  fs.mkdirSync('/@mag')
}
if (!fs.existsSync('/@mag/local')) {
  fs.mkdirSync('/@mag/local')
}

let mainWindow = null, 
    dev = false

diskdb.connect('/@mag/local', ['application', 'config'])

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  dev = true
}

if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

async function start() {
  let config = diskdb.config.find()

  if (config.length == 0) 
    diskdb.config.save({license: null})
  
  if (config.length > 0 && config[0].license != null) {
    let hwidKey = await hwid.getHWID()
    fetch(`http://89.203.248.241/api/index.php?event=check_license&license=${config[0].license}&hwid=${hwidKey}`)
      .then(res => res.json())
      .then(json => {
        json.status == 'success' ?
          mainWindow === null ? createWindow(950, 650, false) : console.error('Main', 'Window already created')
        :
          mainWindow === null ? createWindow(320, 360, false) : console.error('Main', 'Window already created')
      })
  } else {
    // Login window
    if (mainWindow === null)
      createWindow(320, 360, false)

  }
  
}

function createWindow(width, height, canResize) {
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    frame: false,
    transparent: true,
    resizable: canResize,
    webPreferences: {
      nodeIntegration: true, 
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


