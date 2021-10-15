import { isNumber } from "../../ecs/utils/Number";
import SCHEMA, {
  MESSAGE_TYPE_POSITION,
  FIELD_TYPES,
  FIELD_TYPE_BYTES,
  FIELD_TYPE_RANGES,
  FIELD_TYPE,
  MESSAGE_TYPES,
} from "../schema";

type validationError = { [fieldName: string]: string };
type validatorFunction = (fieldName: string, data: any) => validationError[];

class Validator {
  private _fieldValidators: {
    [K in FIELD_TYPE]: validatorFunction;
  };

  constructor() {
    // NOTE: the [K in FIELD_TYPE]: ... above enforces that ALL field types are present in the hash
    // and thus will have a decoder function !!
    this._fieldValidators = {
      // [FIELD_TYPES.UINT_8]: this.validateUInt8,
      [FIELD_TYPES.UINT_8]: this.validateNumber(FIELD_TYPES.UINT_8),
      [FIELD_TYPES.UINT_16]: this.validateNumber(FIELD_TYPES.UINT_16),
      [FIELD_TYPES.INT_32]: this.validateNumber(FIELD_TYPES.INT_32),
      [FIELD_TYPES.FLOAT_32]: this.validateNumber(FIELD_TYPES.FLOAT_32),
      [FIELD_TYPES.STRING]: this.validateString,
      [FIELD_TYPES.UINT_16_ARRAY]: this.validateUInt16Array,
      // TODO: ...more?
    };
  }

  // TODO: validate against schema
  validate = (parsedMessage): validationError[] => {
    const { messageType } = parsedMessage;
    const messageTypeErrors = this.validateMessageType(messageType);
    // Return early since you can't access SCHEMA without proper messageType
    if (0 < messageTypeErrors.length) return messageTypeErrors;

    let errors: validationError[] = [];
    SCHEMA[messageType].binary.forEach(([fieldName, fieldType]: [string, FIELD_TYPE]) => {
      const fieldValidator = this._fieldValidators[fieldType];

      // TODO: presence validator, type validator
      const presenceErrors = this.validatePresence(fieldName, parsedMessage);
      errors = [...errors, ...presenceErrors];
      if (0 < presenceErrors.length) return; // Next iteration, no point checking type for this...

      const fieldValidatorErrors = fieldValidator(fieldName, parsedMessage[fieldName]);
      errors = [...errors, ...fieldValidatorErrors];
    });
    return [];
  };

  private validateMessageType = (messageType: MESSAGE_TYPE): validationError[] => {
    let errors: validationError[] = [];

    const validType = Object.values(MESSAGE_TYPES).some(validMessageType => {
      validMessageType === MESSAGE_TYPES[messageType];
    });
    if (!validType) errors.push({ messageType: `Not a recognized messageType: ${messageType}` });

    return errors;
  };

  private validatePresence = (fieldName: string, parsedMessage: any): validationError[] => {
    return parsedMessage.hasOwnProperty(fieldName) ? [] : [{ [fieldName]: "Blank" }];
  };

  private validateNumber = (fieldType: FIELD_TYPE): validatorFunction => {
    return (fieldName: string, data: any): validationError[] => {
      let errors: validationError[] = [];

      if (!isNumber(data)) errors.push({ [fieldName]: "Not a number" });

      const exceeded = this.validateNumberRange(FIELD_TYPES[fieldType], data);
      if (exceeded) this.numberRangeExceededErrorMessage(FIELD_TYPES[fieldType], exceeded, data);

      return [];
    };
  };

  private validateNumberRange = (fieldType: FIELD_TYPE, data: number): "max" | "min" | null => {
    if (FIELD_TYPE_RANGES[fieldType].max < data) return "max";
    if (data < FIELD_TYPE_RANGES[fieldType].min) return "min";
    return null;
  };

  private numberRangeExceededErrorMessage = (
    fieldType: FIELD_TYPE,
    range: "min" | "max",
    data: number
  ): string => {
    return `Number ${data} while ${range} for ${fieldType} is ${FIELD_TYPE_RANGES[fieldType][range]}`;
  };

  private validateString = (fieldName: string, data: string): validationError[] => {
    let errors: validationError[] = [];

    if (!(typeof data === "string")) errors.push({ [fieldName]: "Not a string" });

    return [];
  };

  private validateUInt16Array = (fieldName: string, data: Uint16Array): validationError[] => {
    let errors: validationError[] = [];

    if (data.BYTES_PER_ELEMENT !== FIELD_TYPE_BYTES[FIELD_TYPES.UINT_16]) {
      errors.push({
        [fieldName]: `Expected BYTES_PER_ELEMENT: ${FIELD_TYPE_BYTES[FIELD_TYPES.UINT_16]}, got: ${
          data.BYTES_PER_ELEMENT
        }`,
      });
    }

    const numberValidator = this._fieldValidators[FIELD_TYPES.UINT_16];
    data.forEach((number: number, index: number) => {
      const numberValidatorErrors = numberValidator(`${fieldName}_${index}`, number);
      errors = [...errors, ...numberValidatorErrors];
    });

    return [];
  };
}

export default new Validator();
