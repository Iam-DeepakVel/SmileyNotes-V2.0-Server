import mongoose from "mongoose";
import { NoteDto, UpdateNoteDto } from "./dtos/notes.dto";
import { Note, NotesModel } from "./notes.model";

export class NotesService {
  constructor(public noteModel: NotesModel) {}

  async createNote(createNoteDto: NoteDto) {
    const newNote = await this.noteModel.create({
      userId: createNoteDto.userId,
      title: createNoteDto.title,
      content: createNoteDto.content,
      label: createNoteDto.label,
    });
    return newNote;
  }

  async getAllNotes(userId: mongoose.Types.ObjectId | undefined) {
    const allNotes = await this.noteModel.find({ userId }).exec();
    return allNotes;
  }

  async getSingleNote(noteId: string) {
    const singleNote = await this.noteModel.findById(noteId).exec();
    return singleNote;
  }

  async updateNote(noteId: string, updateNoteDto: UpdateNoteDto) {
    const updatedNote = await this.noteModel.findOneAndUpdate(
      { _id: noteId },
      {
        title: updateNoteDto.title,
        content: updateNoteDto.content,
        label: updateNoteDto.label,
      },
      { new: true }
    );
    return updatedNote;
  }

  async deleteNote(noteId: string) {
    return await this.noteModel.findByIdAndRemove(noteId).exec();
  }

  async findNoteById(noteId: string) {
    const note = await this.noteModel.findById(noteId).exec();
    return note;
  }
}

export const notesService = new NotesService(Note);
