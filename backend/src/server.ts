import express from "express";
import payload from "payload";
import cron from "node-cron";

require("dotenv").config();
const app = express();

app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);

      cron.schedule("* * * * * *", async () => {
        console.log(await payload.count({ collection: "users" }));
      });
    },
  });

  app.listen(3000);
};

start();
