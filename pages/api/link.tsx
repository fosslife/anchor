import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/db";
import websitelogo from "website-logo";

let linkInsertStmt = db.prepare(
  "INSERT INTO anchor (link, title, tags) VALUES (?, ?, ?)"
);
let updateLinkStmt = db.prepare("UPDATE anchor SET logo=? WHERE link=?");

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

    websitelogo(link, function (err: any, logoinfo: any) {
      if (err) {
        console.log("Error", err);
      }
      if (logoinfo) {
        let icon = logoinfo.icon.href;
        updateLinkStmt.run(icon, link);
      }
    });
  } else {
    let data = linkGetStmt.all();
    res.status(200).json({ data });
  }
  // return res.status(405).json({ message: "Method not allowed" });
}

// "local","dev","test","tech","git","source","github","image","python","opensource"
