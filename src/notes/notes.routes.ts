import { NextFunction, Request, Response, Router } from "express";
import { notesService } from "./notes.service";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../utils/assertIsDefined";

const router = Router();

// Add Note
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const authenticatedUserId = req.session.userId;
  const { title, content, label } = req.body;
  try {
    assertIsDefined(authenticatedUserId);
    if (!title) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Title is required");
    }
    const newNote = await notesService.createNote({
      userId: authenticatedUserId,
      title,
      content,
      label,
    });
    res.status(StatusCodes.CREATED).json(newNote);
  } catch (error) {
    next(error);
  }
});

// Get All Notes
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const authenticatedUserId = req.session.userId;
  try {
    // Making a check whether authenicatedUserId is surely has a value or not
    assertIsDefined(authenticatedUserId);
    const allNotes = await notesService.getAllNotes(authenticatedUserId);
    res.status(StatusCodes.OK).json(allNotes);
  } catch (error) {
    next(error);
  }
});

// Get Single Note
router.get(
  "/:noteId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const authenticatedUserId = req.session.userId;
    try {
      assertIsDefined(authenticatedUserId);
      if (!mongoose.isValidObjectId(noteId)) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid note id");
      }
      const singleNote = await notesService.getSingleNote(noteId);
      if (!singleNote) {
        throw createHttpError(
          StatusCodes.NOT_FOUND,
          `Note with id ${noteId} not found`
        );
      }
      if (!singleNote.userId.equals(authenticatedUserId)) {
        throw createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You cannot access this note"
        );
      }
      res.status(StatusCodes.OK).json(singleNote);
    } catch (error) {
      next(error);
    }
  }
);

// Update Note
router.patch(
  "/:noteId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const { title, content, label } = req.body;
    const authenticatedUserId = req.session.userId;
    try {
      assertIsDefined(authenticatedUserId);
      if (!mongoose.isValidObjectId(noteId)) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid note id");
      }
      if (!title) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Title is required");
      }

      const note = await notesService.findNoteById(noteId);
      if (!note) {
        throw createHttpError(
          StatusCodes.NOT_FOUND,
          `Note with id ${noteId} not found`
        );
      }
      // Checking whether the note that is being updated is his own note
      if (!note.userId.equals(authenticatedUserId)) {
        throw createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You cannot access this note"
        );
      }
      const updatedNote = await notesService.updateNote(noteId, {
        title,
        content,
        label,
      });
      res.status(StatusCodes.OK).json(updatedNote);
    } catch (error) {
      next(error);
    }
  }
);

// Delete Note
router.delete(
  "/:noteId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const authenticatedUserId = req.session.userId;
    try {
      assertIsDefined(authenticatedUserId);
      if (!mongoose.isValidObjectId(noteId)) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid note id");
      }
      const note = await notesService.deleteNote(noteId);
      if (!note) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Note not found");
      }
      // Checking whether the note that is being updated is his own note
      if (!note.userId.equals(authenticatedUserId)) {
        throw createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You cannot access this note"
        );
      }
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }
);

export { router as notesRoutes };
