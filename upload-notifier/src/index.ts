import { createClient } from "redis";
// Create the redis client instance
const client = createClient();

// TODO: Implemet the resilience mechanism
async function main() {
  try {
    // Connect to Redis server
    await client.connect();
    console.log("Client connected to Redis successfully.");
    // Start consuming messages from the "user-uploads" list
    let message;
    while (true) {
      try {
        // Pop the message from the "user-uploads" list
        message = await client.brPop("user-uploads", 0);
        // Publish the message to the "image-notification" channel
        await client.publish("image-notification", message.element);
        // Log the message
        console.log('Message published successfully: ', message);
      } catch (error) {
        console.log("Error in publishing message to pub-sub: ", error);
        // Add the message back to the "user-uploads" list to retry later
        await client.lPush("user-uploads", message.element);
      }
    }
  } catch (error) {
    console.log("Failed to connect to Redis: ", error);
  }
}

main();
