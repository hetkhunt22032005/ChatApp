import { RedisManager } from "./RedisManager";

export class QueueManager {
    private static instance: QueueManager;
    private ignoreCounts: Map<string, number>;

    private constructor() {
        this.ignoreCounts = new Map();
    }

    public static getInstance(): QueueManager {
        if(!this.instance) {
            this.instance = new QueueManager();
        }
        return this.instance;
    }

    public async selectQueues() {
        const finalQueues: {queue: string, priority: number}[] = [];
        const queues = await RedisManager.getInstance().getQueues();
        const timestamps = await RedisManager.getInstance().getTimeStamps(queues);
        const currentTime = Date.now();
        queues.forEach((queue, index) => {
            const timeDifference = timestamps[index] ? currentTime - parseInt(timestamps[index]) : 0;
            const priority = this.calculatePriority(timeDifference, this.ignoreCounts.get(queue) || 0);
            finalQueues.push({
                queue,
                priority
            });
        });
        finalQueues.sort((a, b) => a.priority - b.priority);
        // Give top K queues to the WorkerManager and then track the ignore count of the rest.
    }

    private calculatePriority(timeDifference: number, ignoreCount: number) {
        const TIME_FACTOR = 1;
        const IGNORE_FACTOR = 2;
        const MAX_TIME_FACTOR = 30;

        const timeWeight = Math.min(timeDifference/1000, MAX_TIME_FACTOR); // seconds
        return timeWeight * TIME_FACTOR + ignoreCount + IGNORE_FACTOR;
    }

    public clearCount(queue: string): void {
        this.ignoreCounts.delete(queue);
    }

    public start(): void {
        setInterval(() => {
            this.selectQueues();
        }, 10000);
    }
}
