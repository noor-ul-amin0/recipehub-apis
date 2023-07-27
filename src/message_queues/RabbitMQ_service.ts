import amqp from "amqplib";

const AMQP_URL = process.env.AMQP_URL as string;

export default class RabbitMQService {
  private static instance: RabbitMQService;
  private connection: amqp.Connection | null = null;

  private constructor() {}

  static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
    }
    return RabbitMQService.instance;
  }

  public async connect(): Promise<void> {
    if (!this.connection) {
      this.connection = await amqp.connect(AMQP_URL);
      console.log("Connected to RabbitMQ.");
    }
  }

  public getConnection(): amqp.Connection {
    if (!this.connection) {
      throw new Error("RabbitMQ connection not established.");
    }
    return this.connection;
  }

  public async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      console.log("RabbitMQ connection closed.");
    }
  }
}
