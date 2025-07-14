export * from "./lib/database.js"; //* Database class
export * from "./lib/mongoDatabase.js"; //* MongoDatabase class

import { checker } from "./helper/checker.js";
import fs from "fs";

checker(JSON.parse(fs.readFileSync("package.json", "utf8")).version)