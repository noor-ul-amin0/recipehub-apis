import { ConnectionOptions, Job, Worker } from "bullmq";
import mailService from "../../services/mail";
import { redisConfig } from "../../config/redis";
import { EmailNotificationQueueKeys } from "../../constants/queue_keys";

const sendVerifyRegistrationEmailWorkerHandler = async (
  job: Job
): Promise<any> => {
  console.log("Starting job:");
  await mailService.sendVerificationEmail(job.data);
  let counter = 0;
  for (let i = 0; i < 10_000_000_000; i++) {
    counter++;
  }
  console.log("Finished job:");
  return;
};

const worker = new Worker(
  EmailNotificationQueueKeys.EMAIL_NOTIFICATION,
  sendVerifyRegistrationEmailWorkerHandler,
  {
    connection: redisConfig as ConnectionOptions,
  }
);

worker.on("completed", (job) => {
  console.info(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.error(`${job?.id} has failed with ${err.message}`);
});
