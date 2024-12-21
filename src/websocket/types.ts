import { WebSocket } from 'ws';

export const SUBSCRIBE = "SUBSCRIBE";
export const UNSUBSCRIBE = "UNSUBSCRIBE";
export const SENDMESSAGE = "SENDMESSAGE";

export type SubscribeMessage = {
    method: typeof SUBSCRIBE,
    rooms: string[],
    senderId: string,
}

export type UnsubscribeMessage = {
    method: typeof UNSUBSCRIBE,
    rooms: string[],
    senderId: string,
}

export type SendMessage = {
    method: typeof SENDMESSAGE,
    room: string,
    message: string,
    senderId: string,
}

export type Message = SubscribeMessage | UnsubscribeMessage | SendMessage;
