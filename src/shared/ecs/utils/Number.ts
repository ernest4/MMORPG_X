export const isNumber = (something: any) => typeof something === "number";
export const round = (number: number, decimalPlaces: number = 2) => {
  return Math.round(number * 10 * decimalPlaces) / (10 * decimalPlaces);
};
