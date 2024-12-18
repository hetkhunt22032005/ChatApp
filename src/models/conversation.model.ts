import { model, Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    room: {
      type: String,
      required: true
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Conversation = model("conversation", conversationSchema);

export default Conversation;
