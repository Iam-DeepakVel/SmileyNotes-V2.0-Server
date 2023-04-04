import { Document, model, Model, Schema, Types } from "mongoose";

export interface QuoteDoc extends Document {
  userId: Types.ObjectId;
  quote: string;
  category: string;
}

export type QuoteModel = Model<QuoteDoc>;

const quoteService = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quote: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Quote = model<QuoteDoc, QuoteModel>("Quote", quoteService);
