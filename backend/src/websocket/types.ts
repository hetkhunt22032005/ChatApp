export const SUBSCRIBE = "SUBSCRIBE";
export const UNSUBSCRIBE = "UNSUBSCRIBE";
export const SENDMESSAGE = "SENDMESSAGE";
export const ERRORMESSAGE = "ERRORMESSAGE";

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
  method: typeof SENDMESSAGE;
  room: string;
  message: string;
  senderId: string;
};

export type ErrorMessage = {
  method: string;
  message: string;
};

export type Message = SubscribeMessage | UnsubscribeMessage | SendMessage;
