import mongoose, { Schema, model, Document, models } from "mongoose";
import { IAudit, AuditSchema } from "./audit.model";

export interface IComment extends Document, IAudit {
  id: string;
  userId: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  replies?: IComment[];
}

const CommentSchema = new Schema<IComment>({
  id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

CommentSchema.add(AuditSchema);

const Comment = models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
