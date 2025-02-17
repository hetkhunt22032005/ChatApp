export const SUBSCRIBE = "SUBSCRIBE";
export const UNSUBSCRIBE = "UNSUBSCRIBE";
export const SENDMESSAGE = "SENDMESSAGE";
export const ERRORMESSAGE = "ERRORMESSAGE";
export const PROCESSEDMESSAGE = "PROCESSEDMESSAGE";
export const IMAGENOTIFICATION = "IMAGENOTIFICATION";

export type SubscribeMessage = {
  method: typeof SUBSCRIBE;
  rooms: string[];
  senderId: string;
};

export type UnsubscribeMessage = {
  method: typeof UNSUBSCRIBE;
  rooms: string[];
  senderId: string;
};

export type SendMessage = {
  method: typeof SENDMESSAGE | typeof PROCESSEDMESSAGE;
  senderId: string;
  room: string;
  conversationId: string;
  tempId: string;
  content: {
    text?: string;
    image: false | "pending";
  };
  createdAt: Date;
};

export type ImageNotification = {
  method: typeof IMAGENOTIFICATION;
  room: string;
  senderId: string;
  tempId: string;
  image_url: string;
};

export type UserMessage = SubscribeMessage | UnsubscribeMessage | SendMessage;
