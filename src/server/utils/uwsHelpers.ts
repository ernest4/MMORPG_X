/* Helper function converting Node.js buffer to ArrayBuffer */
export function toArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

/* Either onAborted or simply finished request */
export function onAbortedOrFinishedResponse(response, readStream) {
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
export function pipeStreamOverResponse(response, readStream, totalSize) {
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
