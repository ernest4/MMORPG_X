const path = require("path");
const http = require("http");
const url = require("url");
const fs = require("fs");
const { TickProvider } = require("./server/utils/TickProvider");
const uWS = require("uWebSockets.js"); // TODO: move to using uws for max perf & efficiency !

const { notFound, render } = require("./server/response");
const { debugLog, log } = require("./server/debug");

// const assets = process.env.NODE_ENV == "production" ? "build" : "public";
const assets = "dist";
const publicPath = path.join(__dirname, assets);
const port = process.env.PORT || 3001;

// const frontEndRootFilePath = path.join(publicPath, "index.html");

let cache: any = {};

// /play endpoint for game index.html

// const app = uWS./*SSL*/App({
//   key_file_name: 'misc/key.pem',
//   cert_file_name: 'misc/cert.pem',
//   passphrase: '1234'
// })

// const server = uWS.SSLApp({
const server = uWS.App({
  // key_file_name: 'misc/key.pem',
  // cert_file_name: 'misc/cert.pem',
  // passphrase: '1234'
});

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

// cant get it to work ??!?!?!?!?
server.get("/server/stats/", (response: any, request: any) => {
  // response.write(request); // testing, inspecting request
  response.end("testing");
});

server.get("/play/", (response: any, request: any) => {
  response.write(request); // testing, inspecting request
  response.end("testing");
});

server.ws("/play", {
  /* Options */
  // compression: uWS.SHARED_COMPRESSOR,
  // maxPayloadLength: 16 * 1024 * 1024,
  // idleTimeout: 10,
  /* Handlers */
  open: (ws: any) => {
    console.log("A WebSocket connected!");
  },
  message: (ws: any, message: any, isBinary: any) => {
    /* Ok is false if backpressure was built up, wait for drain */
    let ok = ws.send(message, isBinary);
  },
  drain: (ws: any) => {
    console.log("WebSocket backpressure: " + ws.getBufferedAmount());
  },
  close: (ws: any, code: any, message: any) => {
    console.log("WebSocket closed");
  },
});

server.listen(port, (token: any) => {
  if (token) log(`Listening to port ${port}`);
  else log(`Failed to listen to port ${port}`);
});

// TODO: might strip this out and just use express.js ??
// const server = (req: any, res: any) => {
//   const query = url.parse(req.url, false);

//   if (query.pathname === "/") query.pathname = "index.html";
//   debugLog(`requesting ${query.pathname}`);

//   const fileLoc = path.join(publicPath, query.pathname);

//   // TODOO: implement streaming rather than bulk sending of files https://stackabuse.com/node-http-servers-for-static-file-serving/
//   // to create 'back pressure'. Serves files faster overall when clients are slow.

//   // Check the cache first...
//   if (cache[fileLoc] !== undefined) {
//     debugLog(`returning cached ${fileLoc}`);
//     return render({ data: cache[fileLoc], res });
//   }

//   // ...otherwise load the file, save to the cache and return
// fs.readFile(fileLoc, (err: any, data: any) => {
//   if (err) return notFound(res);

//   debugLog(`caching ${fileLoc}`);
//   cache[fileLoc] = data;

//   return render({ data: cache[fileLoc], res });
// });
// };

// const httpServer = http.createServer(server);

// httpServer.listen(port, () => {
//   log(`Server is up! port ${port}`);
//   log(`Environment: ${process.env.NODE_ENV}`);
// });

// TODO: set up web socket server

// TODO: testing. game loop will be executed by this.
const tickProvider = new TickProvider((deltaTime: number) => console.log(deltaTime));
// tickProvider.start();
