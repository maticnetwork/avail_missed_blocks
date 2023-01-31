import express, { Request, Response } from "express";
import { MissedBlockModel } from "../models/missedblock";

const missedBlockModel = new MissedBlockModel();
export class MissedBlockHandler {
  async index(req: Request, res: Response) {
    const result = await missedBlockModel.index();
    return res.json(result);
  }

  async getAggregatedWithinSpecifiedTime(req: Request, res: Response) {
    try {
      const timeframe: number = parseInt(req.params.id);
      const result = await missedBlockModel.getAggregatedWithinSpecifiedTime(
        timeframe
      );
      let total_block_produced_within_time: number = 0;
      let total_missedblocks: number = 0;

      for (let i = 0; i < result.length; i++) {
        total_block_produced_within_time += Math.abs(
          result[i].block_produced_within_time
        );

        total_missedblocks += Math.abs(result[i].missedblocks);
      }

      const data = {
        total_block_produced_within_time: total_block_produced_within_time,
        total_missed_blocks: total_missedblocks,
        duration_in_hrs: timeframe,
      };
      return res.json(data);
    } catch (error) {
      console.log(error.message);
    }
  }
}
