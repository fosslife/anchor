import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/db";

let linkInsertStmt = db.prepare(
  "INSERT INTO anchor (link, title, tags) VALUES (?, ?, ?)"
);

let tagsInertStmt = db.prepare("INSERT OR IGNORE INTO tags (tag) VALUES (?)");

let linkGetStmt = db.prepare("SELECT * FROM anchor");
// let tagsGetStmt = db.prepare("SELECT * FROM")

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { link, title, tags } = req.body;
  if (req.method === "POST") {
    linkInsertStmt.run(link, title, tags.join(","));
    tags.forEach((e: string) => tagsInertStmt.run(e));

    res.status(200).json({ message: "Done" });
  } else {
    let data = linkGetStmt.get();
    console.log(data);
    res.status(200).json({ message: "Done" });
  }
  // return res.status(405).json({ message: "Method not allowed" });
}
