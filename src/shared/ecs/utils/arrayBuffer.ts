export const duplicateBuffer = (source: ArrayBuffer): ArrayBuffer => {
  var duplicate = new ArrayBuffer(source.byteLength);
  new Uint8Array(duplicate).set(new Uint8Array(source));
  return duplicate;
};
