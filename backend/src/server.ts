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
    },
  });

  cron.schedule("0 0 0 * * *", async () => {
    const students = await payload.find({ collection: "students" });

    for (const student of students.docs) {
      for (const course of (student as any)["courses"]) {
        const attendanceCount = await payload.count({
          collection: "attendances",
          where: {
            and: [
              { course: { equals: course.id } },
              { student: { equals: student.id } },
            ],
          },
        });
        const attendanceNotCreated = attendanceCount.totalDocs === 0;

        if (attendanceNotCreated) {
          await payload.create({
            collection: "attendances",
            data: {
              date: new Date().toISOString(),
              isPresent: false,
              course: course.id,
              student: student.id,
            },
          });
        }
      }
    }
  });

  cron.schedule("0 0 0 * * *", async () => {
    const fees = await payload.find({ collection: "fees" });
    const curDate = new Date();

    for (const fee of fees.docs) {
      const dueDate = new Date((fee as any).dueDate);

      if (curDate > dueDate) {
        await payload.update({
          collection: "fees",
          data: {
            id: fee.id,
            paymentStatus: "delayed",
          },
          where: {
            and: [
              { id: { equals: fee.id } },
              { paymentStatus: { equals: "unpaid" } },
            ],
          },
        });
      }
    }
  });

  app.listen(3000);
};

start();
