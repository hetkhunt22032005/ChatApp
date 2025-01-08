export const PROCESS = "PROCESS";
export const TERMINATE = "TERMINATE";
export const PROCESSED = "PROCESSED";
export const TERMINATED = "TERMINATED";
export const CHATMESSAGE = "PROCESSEDMESSAGE";
export const IMAGENOTIFICATION = "IMAGENOTIFICATION";

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

export type UserMessage = {
  method: typeof CHATMESSAGE,
  senderId: string,
  room: string,
  conversationId: string,
  tempId: string,
  content: {
    text?: string;
    image?: false | "pending";
  },
  createdAt: Date
} | {
  method: typeof IMAGENOTIFICATION,
  room: string,
  senderId: string,
  tempId: string,
  image_url: string,
}
