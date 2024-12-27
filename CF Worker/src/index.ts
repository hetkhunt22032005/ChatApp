import { Hono } from "hono";
import { Bindings, Variables } from "@generics/hono.generic";
import { authenticateClient, authenticateWebhook } from "@middlewares/auth.middleware";

const app = new Hono<{
  Bindings: Bindings,
  Variables: Variables
}>();

app.get("/", (c) => {
  return c.text("ChatApp CF Worker.");
});

app.post("/generate-signed-url", authenticateClient, (c) => {
  return c.text("ChatApp - generate signed URL");
});

app.post("/wh/image/:whsecret", authenticateWebhook, (c) => {
  return c.text("ChatApp - image webhook");
});

export default app;
