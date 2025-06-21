import { Request, Response } from "express";

function upload(req: Request, res: Response) {
  // Check virus
  // Notify Queue manager\

  res.json({
    message: "Success",
  });
}

const fileController = {
  upload,
};
export default fileController;
