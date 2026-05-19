import mongoose, { Schema, models, model } from "mongoose";

export interface IChat {
  userId: mongoose.Types.ObjectId;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Chat = models.Chat || model<IChat>("Chat", ChatSchema);
