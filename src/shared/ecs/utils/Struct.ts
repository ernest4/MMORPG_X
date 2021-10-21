const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const enum TYPES {
  STRING,
  NUMBER,
  // TODO: ... more
}

const SERIALIZERS = {
  [TYPES.STRING]: (string: string) => ArrayBuffer,
  [TYPES.NUMBER]: (number: string) => ArrayBuffer,
};

type Schema = { [key: string]: TYPES };

// TODO: jests

// class Struct extends ArrayBuffer {
class Struct {
  private _arrayBuffer: ArrayBuffer;

  constructor(schema: Schema) {
    // TODO: ...
    // 1. calc entire size of struct from fields and their types
    // 2. construct array buffer to back that data
    // 3. loop over schema and created getter/setter methods for field types that will know how to
    // serialize/deserialize between backing array buffer and plain data
    // 4. auto infer schema from given values??

    Object.entries(schema).forEach(([field, type]) => {
      // this[`_${capitalizeFirstLetter(field)}`] = undefined;
      this[`set${capitalizeFirstLetter(field)}`] = args => {
        // this[`_${capitalizeFirstLetter(field)}`] = SERIALIZERS[type](args);
      };
    });
  }

  get byteLength(): number {
    return this._arrayBuffer.byteLength;
  }
}

export default Struct;
