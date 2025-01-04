export const PROCESS = "PROCESS";
export const TERMINATE = "TERMINATE";
export const PROCESSED = "PROCESSED";
export const TERMINATED = "TERMINATED";

export type WorkerMessgae =
  | {
      method: typeof PROCESSED;
      batchSize: number;
      queue: string;
    }
  | {
      method: typeof TERMINATED;
    };

export type ParentMessages =
  | {
      method: typeof PROCESS;
      messages: string[];
      queue: string;
    }
  | {
      method: typeof TERMINATE;
    };
