import * as express from "express";
import blocks from "./api/missedblock";

const routes = express.Router();
routes.use("/missed-blocks", blocks);

export default routes;
