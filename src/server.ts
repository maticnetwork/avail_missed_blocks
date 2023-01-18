import express from "express";
import routes from "./routes/index";
import { CronService } from "./cron";

const cronJob = new CronService();

const app = express();
const PORT = 7000;

app.use("/api", routes);

cronJob.base();

app.listen(PORT, () => {
  console.log(`starting app on port:${PORT}`);
});
