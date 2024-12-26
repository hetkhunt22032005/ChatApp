import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("ChatApp CF Worker.");
});

export default app;
