import { createClient, RedisClientType } from "redis";

export class RedisManager {
  private static instance: RedisManager;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient();
  }

  public static getInstance(): RedisManager {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public async connectRedis(): Promise<void> {
    try {
      await this.client.connect();
      console.log("Redis connected successfully.");
    } catch (error) {
      console.log("Error in Redis connection: ", error);
      process.exit(1);
    }
  }

  public async getQueues(prefix: string = "queue-"): Promise<string[]> {
    const queues: string[] = [];
    let cursor = 0;

    do {
      const { cursor: nextCursor, keys } = await this.client.scan(cursor, {
        MATCH: `${prefix}*`,
        COUNT: 100
      });
      cursor = nextCursor;
      queues.push(...keys);
    } while (cursor !== 0);

    return queues;
  }

  public async getMessages(
    queue: string,
    batchSize: number = 10
  ): Promise<string[]> {
    let messages: string[];
    messages = await this.client.lRange(queue, -batchSize, -1);

    return messages;
  }

  public async clearMessages(
    queue: string,
    batchSize: number
  ): Promise<void> {
    await this.client.lTrim(queue, 0, -batchSize - 1);
  }
}
