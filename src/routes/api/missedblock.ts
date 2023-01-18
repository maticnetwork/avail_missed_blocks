import express from "express";

import { MissedBlockHandler } from "../../handlers/missedblock";

const missedblockMothods = new MissedBlockHandler();

const missedblocks = express.Router();

missedblocks.get("/", missedblockMothods.index);
missedblocks.get("/:id", missedblockMothods.getAggregatedWithinSpecifiedTime);

export default missedblocks;
