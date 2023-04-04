import mongoose from "mongoose";

export interface createQuoteDto {
  quote?: string;
  category?: string;
  userId?: mongoose.Types.ObjectId;
}

export interface UpdateQuoteDto {
  quote?: string;
  category?: string;
}
