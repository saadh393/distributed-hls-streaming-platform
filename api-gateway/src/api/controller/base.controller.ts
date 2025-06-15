import { Request, Response } from "express";
import path from "path";

export function homePage(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "../../../public", "index.html"));
}
