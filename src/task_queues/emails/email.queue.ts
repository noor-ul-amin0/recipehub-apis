import { ConnectionOptions, Job, Queue } from "bullmq";
import { redisConfig } from "../../config/redis";
import { EmailNotificationQueueKeys } from "../../constants/queue_keys";

export const emailNotificationQueue = new Queue(
  EmailNotificationQueueKeys.EMAIL_NOTIFICATION,
  {
    connection: redisConfig as ConnectionOptions,
  }
);

export async function addEmailNotificationJob(jobKey: string, job: any) {
  await emailNotificationQueue.add(jobKey, job);
}
