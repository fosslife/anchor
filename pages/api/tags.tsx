import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/db";

let tagsGetStmt = db.prepare("SELECT tag from tags LIMIT ?");
let tagsSearchStmt = db.prepare("SELECT tag from tags WHERE tag LIKE ?");
let tagsInertStmt = db.prepare("INSERT OR IGNORE INTO tags (tag) VALUES (?)");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;
  if (req.method === "POST") {
    tagsInertStmt.run(req.body.tag);
    return res.status(201).send({ message: "tag created" });
  }
  if (query.q) {
    let searchRes = tagsSearchStmt.all(`%${query.q}%`);
    return res.send(searchRes.map((t) => t.tag));
  }
  let firstTenTags = tagsGetStmt.all(10);
  res.send(firstTenTags.map((t) => t.tag));
}
