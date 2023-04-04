import { Document, Model, model, Schema, Types } from "mongoose";

export interface NotesDoc extends Document {
  title: string;
  content?: string;
  label?: number;
  userId: Types.ObjectId;
}

export type NotesModel = Model<NotesDoc>;

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    label: {
      type: Number,
      default: 3,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);

export const Note = model<NotesDoc, NotesModel>("Note", noteSchema);
