// TYPES sample (advanced)

// export const FIELD_TYPES = {
//   UINT_8: "UInt8",
//   UINT_16: "UInt16",
//   INT_32: "Int32",
//   FLOAT_32: "Float32",
//   STRING: "String",
//   UINT_16_ARRAY: "UInt16Array",
// } as const;

// // Use values of object as type
// const testy = (types: typeof FIELD_TYPES[keyof typeof FIELD_TYPES]) => {};
// testy("Float32");

// // Use keys of object as type
// const testy = (types: keyof typeof FIELD_TYPES) => {};
// testy("FLOAT_32");

// // Use object as type
// const testy = (types: typeof FIELD_TYPES) => {};
// testy(FIELD_TYPES);
