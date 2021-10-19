// TODO: read / set version dynamically??
// import path from "path";
// import fs from "fs";

// const packageJsonPath = path.join(process.cwd(), "package.json");
// const rawPackageJson = fs.readFileSync(packageJsonPath).toString();
// const PackageJson = JSON.parse(rawPackageJson);
// const { version: VERSION } = PackageJson;

// export VERSION;

// @ts-ignore
export const SERVER = typeof window === "undefined";

// TODO: reduce console noise. process is not defined in the browser but this code is shared and
// will run in the browser, producing error noise..
export const DEVELOPMENT = SERVER && process.env.NODE_ENV !== "production";
export const PORT = (SERVER && process.env.PORT && parseInt(process.env.PORT)) || 3001;
