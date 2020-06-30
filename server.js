/******************************************************************************
 * (c) 2005-2019 Copyright, Real-Time Innovations.  All rights reserved.       *
 * No duplications, whole or partial, manual or electronic, may be made        *
 * without express written permission.  Any such copies, or revisions thereof, *
 * must display this notice unaltered.                                         *
 * This code contains trade secrets of Real-Time Innovations, Inc.             *
 ******************************************************************************/

//import { createServer } from 'http';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { join } from "path";

import { listen } from "socket.io";
import connector from "./RTIConnector";
import Container from "./container";

import gppRouter from "./routes/gpp.router";

import { circleConverter } from "./ddsDataConverter/circleConverter";
import { triangleConverter } from "./ddsDataConverter/triangleConverter";
import { squareConverter } from "./ddsDataConverter/squareConverter";

var app = express();

const PORT = process.env.PORT || 8080;
const HOST = "127.0.0.1";

var corsOptions = {
  origin: "http://localhost:8080",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.json({ message: "Welcome to GPP application." });
});

var server = app.listen(PORT, HOST, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});

//db.sequelize.sync();

/***************** RTI *****************************************/
const fullpath = join(__dirname, "./ShapeExample.xml");

const container = new Container();
const io = listen(server);
var rti = new connector(
  io,
  fullpath,
  "MyParticipantLibrary::TransformationParticipant"
);
container.singleton("rti_connector", rti);

rti.registerSubscriber("MySubscriber::MySquareReader", "square");
rti.registerSubscriber("MySubscriber::MyTriangleReader", "triangle");
rti.registerSubscriber("MySubscriber::MyCircleReader", "circle");

rti.registerPublisher("MyPublisher::MyCircleWriter", "circle", circleConverter);
rti.registerPublisher("MyPublisher::MySquareWriter", "square", squareConverter);
rti.registerPublisher(
  "MyPublisher::MyTriangleWriter",
  "triangle",
  triangleConverter
);
/***********************************************************/
app.set("context", container);
app.use("/gpp", gppRouter);
