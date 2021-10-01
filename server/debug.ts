const DEBUG_SERVER = process.env.DEBUG_LOG === "true" || process.env.NODE_ENV !== "production";

exports.log = (msg: any) => console.log(`[Server]: ${msg}`);

exports.debugLog = (msg: any) => {
  if (DEBUG_SERVER) console.log(`[Server]: ${msg}`);
};
