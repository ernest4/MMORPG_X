import path from "path";
import url from "url";
import fs from "fs";
import uWS from "uWebSockets.js";
import Game from "./Game";
import os from "os";
import { PORT } from "../shared/utils/environment";
import { pipeStreamOverResponse } from "./utils/uwsHelpers";

const STATICS_PATH = path.join("dist", "statics");
const ASSETS_PATH = path.join(STATICS_PATH, "assets");

const server = uWS.App({});

// server
//   .any("/anything", (res, req) => {
//     res.end("Any route with method: " + req.getMethod());
//   })
//   .get("/user/agent", (res, req) => {
//     /* Read headers */
//     res.end("Your user agent is: " + req.getHeader("user-agent") + " thank you, come again!");
//   })
//   .get("/static/yes", (res, req) => {
//     /* Static match */
//     res.end("This is very static");
//   })
//   .get("/candy/:kind", (res, req) => {
//     /* Parameters */
//     res.end("So you want candy? Have some " + req.getParameter(0) + "!");
//   })
//   .get("/*", (res, req) => {
//     /* Wildcards - make sure to catch them last */
//     res.end("Nothing to see here!");
//   });

server.get("/", (response: uWS.HttpResponse, request: uWS.HttpRequest) => {
  const fileLocation = path.join(STATICS_PATH, "index.html");

  /* Create read stream with Node.js and start streaming over Http */
  const readStream = fs.createReadStream(fileLocation);
  const totalSize = fs.statSync(fileLocation).size;
  pipeStreamOverResponse(response, readStream, totalSize);
});

server.get("/statics/*", (response: uWS.HttpResponse, request: uWS.HttpRequest) => {
  const fileLocation = path.join("dist", request.getUrl());

  /* Create read stream with Node.js and start streaming over Http */
  const readStream = fs.createReadStream(fileLocation);
  const totalSize = fs.statSync(fileLocation).size;
  pipeStreamOverResponse(response, readStream, totalSize);
});

// TODO: hide it behind admin auth
server.get("/server/stats/", (response: uWS.HttpResponse, request: uWS.HttpRequest) => {
  // response.write(request); // testing, inspecting request
  response.end(`os CPUs: ${os.cpus().length}`);
});

const game = new Game(server);
game.run();

server.listen(PORT, (listenSocket: any) => {
  if (listenSocket) console.log(`Listening to port ${PORT}`);
  else console.log(`Failed to listen to port ${PORT}`);
});
