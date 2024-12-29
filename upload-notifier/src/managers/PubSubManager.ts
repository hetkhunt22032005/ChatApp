import { createClient, RedisClientType } from "redis";

export class PubSubManager {
    private static instance: PubSubManager;
    private client: RedisClientType

    constructor() {
        this.client = createClient();
    }

    public static getInstance(): PubSubManager {
        if(!this.instance) {
            this.instance = new PubSubManager();
        }
        return this.instance;
    }

    public async connectRedis(): Promise<void> {
        try {
            await this.client.connect();
            console.log('Redis conected successfully.');
        } catch (error) {
            console.log('Error in redis connection: ', error);
            process.exit(1);
        }
    }

    public async publish(channel: string, message: string) {
       try {
        await this.client.publish(channel, message);
       } catch (error) {
        console.log('Error in publishing image notification');
        throw error;
       }
    }
}