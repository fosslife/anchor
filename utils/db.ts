import Database from "better-sqlite3";

const db = new Database("anchordb", { verbose: console.log });
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS anchor(
    link TEXT NOT NULL,
    title TEXT NOT NULL,
    tags TEXT NOT NULL
 )
`);

db.exec(`
CREATE TABLE IF NOT EXISTS tags(
    tag TEXT NOT NULL,
    UNIQUE (tag)
)
`);

export { db };
