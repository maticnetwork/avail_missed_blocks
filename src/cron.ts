import cron from "node-cron";
import { Subscription } from "./scripts/subsription";

const sub = new Subscription();

export class CronService {
  async base() {
    //every minute
    cron.schedule("* * * * *", async () => {
      console.log("Running Cron Job for getting last block header");
      sub.main();
    });
  }
}
