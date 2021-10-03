import path from "path";
import http from "http";
import url from "url";
import fs from "fs";
import uWS from "uWebSockets.js"; // TODO: move to using uws for max perf & efficiency!
import Game from "./Game";
import { PORT } from "../shared/utils/environment";

// const assets = process.env.NODE_ENV == "production" ? "build" : "public";
// const assets = "dist";
const STATICS_PATH = path.join("dist", "statics");
const ASSETS_PATH = path.join(STATICS_PATH, "assets");

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

/* Helper function converting Node.js buffer to ArrayBuffer */
function toArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

/* Either onAborted or simply finished request */
function onAbortedOrFinishedResponse(response, readStream) {
  if (response.id == -1) {
    console.log("ERROR! onAbortedOrFinishedResponse called twice for the same res!");
  } else {
    console.log("Stream was closed");
    console.timeEnd(response.id);
    readStream.destroy();
  }

  /* Mark this response already accounted for */
  response.id = -1;
}

/* Helper function to pipe the ReadaleStream over an Http responses */
function pipeStreamOverResponse(response, readStream, totalSize) {
  /* Careful! If Node.js would emit error before the first res.tryEnd, res will hang and never time out */
  /* For this demo, I skipped checking for Node.js errors, you are free to PR fixes to this example */
  readStream
    .on("data", chunk => {
      /* We only take standard V8 units of data */
      const ab = toArrayBuffer(chunk);

      /* Store where we are, globally, in our response */
      let lastOffset = response.getWriteOffset();

      /* Streaming a chunk returns whether that chunk was sent, and if that chunk was last */
      let [ok, done] = response.tryEnd(ab, totalSize);

      /* Did we successfully send last chunk? */
      if (done) {
        onAbortedOrFinishedResponse(response, readStream);
      } else if (!ok) {
        /* If we could not send this chunk, pause */
        readStream.pause();

        /* Save unsent chunk for when we can send it */
        response.ab = ab;
        response.abOffset = lastOffset;

        /* Register async handlers for drainage */
        response.onWritable(offset => {
          /* Here the timeout is off, we can spend as much time before calling tryEnd we want to */

          /* On failure the timeout will start */
          let [ok, done] = response.tryEnd(
            response.ab.slice(offset - response.abOffset),
            totalSize
          );
          if (done) {
            onAbortedOrFinishedResponse(response, readStream);
          } else if (ok) {
            /* We sent a chunk and it was not the last one, so let's resume reading.
             * Timeout is still disabled, so we can spend any amount of time waiting
             * for more chunks to send. */
            readStream.resume();
          }

          /* We always have to return true/false in onWritable.
           * If you did not send anything, return true for success. */
          return ok;
        });
      }
    })
    .on("error", () => {
      /* Todo: handle errors of the stream, probably good to simply close the response */
      console.log("Unhandled read error from Node.js, you need to handle this!");
      response.end("error");
    });

  /* If you plan to asyncronously respond later on, you MUST listen to onAborted BEFORE returning */
  response.onAborted(() => {
    onAbortedOrFinishedResponse(response, readStream);
  });
}

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

// cant get it to work ??!?!?!?!?
server.get("/server/stats/", (response: any, request: any) => {
  // response.write(request); // testing, inspecting request
  response.end("testing");
});

// TODO: move this to network systems in ECS
server.ws("/play", {
  /* Options */
  // compression: uWS.SHARED_COMPRESSOR,
  // maxPayloadLength: 16 * 1024 * 1024,
  // idleTimeout: 10,
  /* Handlers */
  open: (ws: uWS.WebSocket) => {
    console.log("A WebSocket connected!");
  },
  message: (ws: uWS.WebSocket, message: ArrayBuffer, isBinary: boolean) => {
    /* Ok is false if backpressure was built up, wait for drain */
    let ok = ws.send(message, isBinary);
  },
  drain: (ws: uWS.WebSocket) => {
    console.log("WebSocket backpressure: " + ws.getBufferedAmount());
  },
  close: (ws: uWS.WebSocket, code: number, message: ArrayBuffer) => {
    console.log("WebSocket closed");
  },
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

const game = new Game(server);
game.run();

server.listen(PORT, (listenSocket: any) => {
  if (listenSocket) console.log(`Listening to port ${PORT}`);
  else console.log(`Failed to listen to port ${PORT}`);
});
