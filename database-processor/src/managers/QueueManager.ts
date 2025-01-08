import { RedisManager } from "./RedisManager";
import { WorkerManager } from "./WorkerManager";

export class QueueManager {
  private static instance: QueueManager;
  private ignoreCounts: Map<string, number>;
  private k: number;
  private TIME_FACTOR;
  private IGNORE_FACTOR;
  private MAX_TIME_FACTOR;
  private IGNORE_THRESHOLD;
  private IGNORE_BOOST;

  private constructor() {
    this.ignoreCounts = new Map();
    this.k = 25;
    this.TIME_FACTOR = 1;
    this.IGNORE_FACTOR = 2;
    this.MAX_TIME_FACTOR = 30;
    this.IGNORE_THRESHOLD = 3;
    this.IGNORE_BOOST = 15;
  }

  public static getInstance(): QueueManager {
    if (!this.instance) {
      this.instance = new QueueManager();
    }
    return this.instance;
  }

  private async selectQueues(): Promise<void> {
    const finalQueues: { queue: string; priority: number }[] = [];
    const queues = await RedisManager.getInstance().getQueues();
    console.log(queues);
    if (queues.length === 0) return;
    const timestamps = await RedisManager.getInstance().getTimeStamps(queues);
    console.log(timestamps);
    const currentTime = Date.now();
    queues.forEach((queue, index) => {
      const timeDifference = timestamps[index]
        ? currentTime - parseInt(timestamps[index])
        : 0;
      const priority = this.calculatePriority(
        timeDifference,
        this.ignoreCounts.get(queue) || 0
      );
      finalQueues.push({
        queue,
        priority,
      });
    });
    finalQueues.sort((a, b) => a.priority - b.priority);
    const topKQueues = finalQueues.splice(0, this.k);
    const remianingQueues = finalQueues.splice(this.k);
    WorkerManager.getInstance().addTasks(
      topKQueues.map((queue) => queue.queue)
    );
    topKQueues.forEach((queue) => {
      this.ignoreCounts.delete(queue.queue);
    });
    remianingQueues.forEach((queue) => {
      this.ignoreCounts.set(
        queue.queue,
        (this.ignoreCounts.get(queue.queue) || 0) + 1
      );
    });
  }

  private calculatePriority(timeDifference: number, ignoreCount: number): number {
    const timeWeight = Math.min(timeDifference / 1000, this.MAX_TIME_FACTOR); // seconds
    const ignoreBoost =
      ignoreCount > this.IGNORE_THRESHOLD ? this.IGNORE_BOOST : 0;
    return (
      timeWeight * this.TIME_FACTOR +
      ignoreCount * this.IGNORE_FACTOR +
      ignoreBoost
    );
  }

  public async start(): Promise<void> {
    this.selectQueues();
    setInterval(() => {
      this.selectQueues();
    }, 10000);
  }
}
