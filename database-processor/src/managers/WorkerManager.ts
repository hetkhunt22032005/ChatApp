import { resolve } from "path";
import { Worker } from "worker_threads";
import { RedisManager } from "./RedisManager";
import {
  PROCESS,
  PROCESSED,
  TERMINATE,
  TERMINATED,
  WorkerMessgae,
} from "../types";

export class WorkerManager {
  private static instance: WorkerManager;
  private pendingTasks: string[];
  private activeTasks: Map<string, string>;
  private status: "active" | "inactive";
  private MAX_WORKERS: number;

  private constructor() {
    this.pendingTasks = [];
    this.activeTasks = new Map();
    this.status = "inactive";
    this.MAX_WORKERS = 5;
  }

  public static getInstance(): WorkerManager {
    if (!this.instance) {
      this.instance = new WorkerManager();
    }
    return this.instance;
  }

  public addTasks(tasks: string[]): void {
    this.pendingTasks.push(...tasks);
    if (this.status === "inactive" || this.getIdleWorkers()) {
      this.spawnWorkers();
    }
  }

  private async spawnWorkers() {
    const idleWorkers = this.getIdleWorkers();
    if (idleWorkers) {
      for (let i = 0; i < idleWorkers; i++) {
        await this.createWorker();
      }
    }
  }

  private async createWorker() {
    const workerId = this.getRandomId();
    const queue = this.getTask(workerId);
    if (!queue) return;

    const extension = process.env.NODE_ENV === "development" ? ".ts" : ".js";
    const worker = new Worker(
      resolve(__dirname, `../types/Worker.${extension}`)
    );
    const messages = await RedisManager.getInstance().getMessages(queue);
    worker.postMessage({ method: PROCESS, messages });

    worker.on("message", async (message: WorkerMessgae) => {
      switch (message.method) {
        case PROCESSED:
          await RedisManager.getInstance().clearMessages(
            message.queue,
            message.batchSize
          );
          const nextQueue = this.getTask(workerId);
          if (!nextQueue) {
            worker.postMessage({ method: TERMINATE });
            return;
          }
          const messages = await RedisManager.getInstance().getMessages(
            nextQueue
          );
          worker.postMessage({ method: PROCESS, messages });
        case TERMINATED:
          console.log("Worker terminated successfully: ", workerId);
          this.handleStatus(workerId);
      }
    });

    worker.on("error", (err: Error) => {
      console.log("Error occurred in worker: " + workerId + ": ", err.message);
      this.handleStatus(workerId);
    });
  }

  private getTask(workerId: string) {
    const taskId = this.pendingTasks.shift();
    if (!taskId) {
      return undefined;
    }
    this.activeTasks.set(workerId, taskId);
    return taskId;
  }

  private getRandomId() {
    return Math.random().toString(36).substring(2, 6);
  }

  private getIdleWorkers() {
    return this.MAX_WORKERS - Math.min(this.MAX_WORKERS, this.activeTasks.size);
  }

  private handleStatus(workerId: string) {
    this.activeTasks.delete(workerId);
    if (this.activeTasks.size === 0) {
      this.status = "inactive";
    }
  }
}
