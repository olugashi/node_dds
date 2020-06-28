/******************************************************************************
* (c) 2005-2019 Copyright, Real-Time Innovations.  All rights reserved.       *
* No duplications, whole or partial, manual or electronic, may be made        *
* without express written permission.  Any such copies, or revisions thereof, *
* must display this notice unaltered.                                         *
* This code contains trade secrets of Real-Time Innovations, Inc.             *
******************************************************************************/

//import { createServer } from 'http';
import express from 'express'
import bodyParser from 'body-parser'
var app = express();
var router = express.Router()
import path from 'path';
import { readFile } from 'fs';
//const rti = require('rticonnextdds-connector')
import { listen } from 'socket.io';
import connector from './RTIConnector';
import gpp from './gpp'
import Container from './container'

var server = app.listen(7400, "127.0.0.1", function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
})

app.use(bodyParser.json())

app.get('/', function (req, res) {
  console.log("Got a GET request for the homepage");
  res.send('Hello GET');
})

app.get('/simple',function (req, res) 
{
    readFile(path.join(__dirname, 'indexSimple.html'), (error, data) => {
      if (error) 
      {
        console.log('Error: ' + error)
        throw new Error(error)
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(data, 'utf-8')
      } 
    })
})



const container = new Container()
const io = listen(server)
var rti =  new connector(io);

container.singleton('rti_connector', rti)
//container.get("rti_connector").writeData({x:100 , y: 100 ,shapesize: 30 ,color :'RED' },'circle');

app.set('context', container)
app.use("/gpp", gpp)

// Create the HTTP server (and configure it to serve the requested visualisation)
/*const server = createServer(function (req, res) {
  if (req.url === '/simple') {
    readFile(path.join(__dirname, 'indexSimple.html'), (error, data) => {
      if (error) {
        console.log('Error: ' + error)
        throw new Error(error)
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(data, 'utf-8')
      }
    })
  } else if (req.url === '/maps') {
    readFile(path.join(__dirname, 'indexMaps.html'), (error, data) => {
      if (error) {
        console.log('Error: ' + error)
        throw new Error(error)
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(data, 'utf-8')
      }
    })
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write("Select your visualisation: <a href='simple'>simple</a> or <a href='maps'>maps</a>")
    res.end()
  }
}).listen(7400, '127.0.0.1')
console.log('Server running at http://127.0.0.1:7400/')*/

// Create the DDS entities required for this example - a reader of Triangle, Circle
// and Square (all under the same participant).

//const io = listen(server)
//var rti1 =  new connector(io);

/*var myVar = setInterval(()=>{
  rti1.writeData({x:100 , y: 100 ,shapesize: 30 ,color :'RED' },'circle');
  rti1.writeData({x:20 , y: 20 ,shapesize: 30 ,color :'BLUE' },'square');
  rti1.writeData({x:150 , y: 150 ,shapesize: 30 ,color :'CYAN' },'triangle');
  
}, 1000);*/

