import { Level } from "level";

const db = new Level("anchordb", { valueEncoding: "json" });

export { db };
