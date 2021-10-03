// import path from "path";
// import fs from "fs";

// const packageJsonPath = path.join(process.cwd(), "package.json");
// const rawPackageJson = fs.readFileSync(packageJsonPath).toString();
// const PackageJson = JSON.parse(rawPackageJson);
// const { version: VERSION } = PackageJson;

// export VERSION;

export const DEVELOPMENT = process.env.NODE_ENV !== "production";
