// const primary = "#eb2190";
// const secondary = "#21ebd3";
// const tertiary = "#ebb321";

module.exports = {
  purge: [],
  // theme: {
  //   extend: {},
  //   backgroundColor: theme => ({
  //     ...theme("colors"),
  //     primary,
  //     secondary,
  //     tertiary,
  //     // danger: "#e3342f",
  //   }),
  //   borderColor: theme => ({
  //     ...theme("colors"),
  //     // default: theme("colors.gray.300", "currentColor"),
  //     primary,
  //     secondary,
  //     tertiary,
  //     // danger: "#e3342f",
  //   }),
  //   textColor: theme => ({
  //     ...theme("colors"),
  //     primary,
  //     secondary,
  //     tertiary,
  //     // danger: "#e3342f",
  //   }),
  // },
  variants: {
    textColor: ["responsive", "hover", "focus", "group-hover"],
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
