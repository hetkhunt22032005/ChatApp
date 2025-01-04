import { parentPort } from "worker_threads";
import { connectDB, closeDB } from "../config/db";
import { ParentMessages, PROCESS, PROCESSED, TERMINATE, TERMINATED } from ".";

let DBStatus = "disconnected";

async function processMessage(message: string[], queue: string) {
  if (DBStatus === "disconnected") {
    await connectDB();
    DBStatus = "connected";
  }
  // Do the actual message storing
  parentPort?.postMessage({method: PROCESSED, batchSize: message.length, queue: queue});
}

async function terminate() {
  if (DBStatus === "connected") {
    await closeDB();
    DBStatus = "disconnected";
  }
  parentPort?.postMessage({ method: TERMINATED });
}

parentPort?.on("message", async (message: ParentMessages) => {
  switch (message.method) {
    case PROCESS:
      processMessage(message.messages, message.queue);
      break;
    case TERMINATE:
      terminate();
  }
});
