import cron from "node-cron";
import { Subscription } from "./scripts/subsription";

const sub = new Subscription();

export class CronService {
  async base() {
    //every minute
    cron.schedule("* * * * *", async () => {
      console.log("Running Cron Job for Charging Customer on Due date");
      sub.main();
    });
  }
}
