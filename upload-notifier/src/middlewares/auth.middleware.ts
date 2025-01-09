import { NextFunction, Request, Response } from "express";

const authenticateWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch the webhook secret
    const whsecret = req.params["whsecret"];
    // Validate the webhook secret
    if (process.env.WH_SECRET !== whsecret) {
      res.status(400).json({ messsage: "Unauthorized" });
      return;
    }
    // next
    next();
  } catch (error: any) {
    console.log("Error in authenticateWebhook middleware: " + error.message);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default authenticateWebhook;
