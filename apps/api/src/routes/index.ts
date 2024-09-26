import type { Request, Response } from "express";

export const get = async (_: Request, res: Response) => {
  return res.json({ message: "Hey API ✨" });
};
