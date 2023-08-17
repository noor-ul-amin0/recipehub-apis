import amqp from "amqplib";
import { EmailToken } from "../types/user";
import RabbitMQService from "./RabbitMQ_service";
import MailService from "../services/mailService";
import { EmailNotificationQueueKeys } from "./queue_keys";
import { Recipe } from "../types/recipe";
import userRepository from "../repositories/users";

export default class EmailWorker {
  mailService = new MailService();
  private channel: amqp.Channel | null = null;

  async setup(queueKey: EmailNotificationQueueKeys): Promise<void> {
    try {
      const rabbitMQService = RabbitMQService.getInstance();
      await rabbitMQService.connect();
      const connection = rabbitMQService.getConnection();

      const QUEUE_NAME = EmailNotificationQueueKeys[queueKey];
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(QUEUE_NAME, { durable: true });
      switch (queueKey) {
        case EmailNotificationQueueKeys.SIGNUP_NOTIFICATION:
          this.channel.consume(QUEUE_NAME, this.processSignUp.bind(this));
          break;
        case EmailNotificationQueueKeys.RECIPE_NOTIFICATION:
          this.channel.consume(QUEUE_NAME, this.processCreateRecipe.bind(this));
          break;

        default:
          throw new Error("Something went wrong with queue setup");
          break;
      }

      console.log("EmailWorker is set up and ready.");
    } catch (error) {
      console.error("Error in RabbitMQ setup:", error);
      throw error;
    }
  }

  private async processSignUp(msg: amqp.ConsumeMessage | null): Promise<void> {
    if (!msg) return;

    try {
      const payload: EmailToken = JSON.parse(msg.content.toString());
      await this.sendVerificationEmail(payload);
      this.channel?.ack(msg);
    } catch (error) {
      console.error("Error in processing signup:", error);
      this.channel?.nack(msg, false, false); // Reject the message and don't requeue
    }
  }

  private async processCreateRecipe(
    msg: amqp.ConsumeMessage | null
  ): Promise<void> {
    if (!msg) return;
    try {
      const recipeData: Recipe = JSON.parse(msg.content.toString());

      // Get all users from the database
      const allUsers = await userRepository.findAll({
        is_verified: true,
      });
      const notificationPromises = [];
      // Send recipe notification email to all users
      for (const user of allUsers) {
        // Implement your email sending logic for recipe notifications here
        // You can use the existing MailService or create a separate MailService instance here
        notificationPromises.push(
          this.mailService.sendRecipeAddedEmailNotification(
            {
              full_name: user.full_name,
              email: user.email,
            },
            recipeData
          )
        );
      }
      await Promise.all(notificationPromises);
      // Perform the actual tasks here based on the message payload
      this.channel?.ack(msg);
    } catch (error) {
      console.error("Error in processing signup:", error);
      this.channel?.nack(msg, false, false); // Reject the message and don't requeue
    }
  }
  private async sendVerificationEmail(payload: EmailToken): Promise<void> {
    // Implement your email sending logic here
    // You can use the existing MailService or create a separate MailService instance here
    try {
      await this.mailService.sendVerificationEmail(payload);
    } catch (error) {
      console.log(
        `Something went wrong while sending verification email, %s`,
        error
      );
    }
  }
  public async enqueueSignUpNotificationJob(
    payload: EmailToken
  ): Promise<void> {
    try {
      if (!this.channel) throw new Error("RabbitMQ channel not initialized.");
      this.channel.sendToQueue(
        EmailNotificationQueueKeys.SIGNUP_NOTIFICATION,
        Buffer.from(JSON.stringify(payload))
      );
      console.log("Enqueued signup verification email job.");
    } catch (error) {
      console.error(
        "Error in enqueueing signup verification email job to RabbitMQ:",
        error
      );
      throw error; // Rethrow the error to handle enqueueing failure
    }
  }
  public async enqueueRecipeCreationEmailNotificationJob(
    recipeData: Recipe
  ): Promise<void> {
    try {
      if (!this.channel) throw new Error("RabbitMQ channel not initialized.");
      this.channel.sendToQueue(
        EmailNotificationQueueKeys.RECIPE_NOTIFICATION,
        Buffer.from(JSON.stringify(recipeData))
      );
      console.log("Enqueued recipe added email notification job.");
    } catch (error) {
      console.error(
        "Error in enqueueing recipe added email notification job to RabbitMQ:",
        error
      );
      throw error; // Rethrow the error to handle enqueueing failure
    }
  }
  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    console.log("EmailWorker is closed.");
  }
}
