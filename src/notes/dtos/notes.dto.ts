import mongoose from "mongoose";

export interface NoteDto {
  title?: string;
  content?: string;
  label?: number;
  userId?: mongoose.Types.ObjectId;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  label?: number;
}
