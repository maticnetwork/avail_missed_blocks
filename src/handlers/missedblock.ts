import express, { Request, Response } from "express";
import { MissedBlockModel } from "../models/missedblock";

const missedBlockModel = new MissedBlockModel();
export class MissedBlockHandler {
  async index(req: Request, res: Response) {
    const result = await missedBlockModel.index();
    return res.json(result);
  }
}
