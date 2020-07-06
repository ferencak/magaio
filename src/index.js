import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Routes from './router'
import * as Diskdb from 'diskdb'

import './assets/css/global.css'

let root = document.createElement('div'),
    link = document.createElement('link'),
    db = Diskdb.connect('/@mag/local', ['application'])

let appConf = db.application.find()[0]
db.application.update({build: appConf.build}, {build: appConf.build + 1}, {multi: false, upsert: false})

root.id = 'root'
document.body.appendChild(root)

link.rel = 'stylesheet'
link.type = 'text/css'
link.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css'

// Append link element to HTML head 
document.head.appendChild(link);  
render((
  <BrowserRouter>
    <Routes/>
  </BrowserRouter>
), document.getElementById('root'));
