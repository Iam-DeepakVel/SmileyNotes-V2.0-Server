import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { requireAuth } from "../middlewares/auth";
import { assertIsDefined } from "../utils/assertIsDefined";
import { quotesService } from "./quotes.service";

const router = Router();

// Add Quote
router.post(
  "/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedUserId = req.session.userId;
    const { quote, category } = req.body;
    try {
      assertIsDefined(authenticatedUserId);
      if (!quote || !category) {
        throw createHttpError(
          StatusCodes.BAD_REQUEST,
          "Fields cannot be empty"
        );
      }
      const newNote = await quotesService.addQuote({
        userId: authenticatedUserId,
        quote,
        category,
      });
      res.status(StatusCodes.CREATED).json(newNote);
    } catch (error) {
      next(error);
    }
  }
);

// Get All Quotes
router.get(
  "/all-users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allQuotes = await quotesService.getAllQuotes();
      res.status(StatusCodes.OK).json(allQuotes);
    } catch (error) {
      next(error);
    }
  }
);

// Get All Quotes of loggedin User
router.get(
  "/loggedin-user",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedUserId = req.session.userId;
    try {
      // Making a check whether authenicatedUserId is surely has a value or not
      assertIsDefined(authenticatedUserId);
      const allQuotesOfLoggedinUser = await quotesService.getLoggedinUserQuotes(
        authenticatedUserId
      );
      res.status(StatusCodes.OK).json(allQuotesOfLoggedinUser);
    } catch (error) {
      next(error);
    }
  }
);

// Get Single Quote
router.get(
  "/:quoteId",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const authenticatedUserId = req.session.userId;
    try {
      assertIsDefined(authenticatedUserId);
      if (!mongoose.isValidObjectId(quoteId)) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid quote id");
      }
      const singleQuote = await quotesService.getSingleQuotebyId(quoteId);
      if (!singleQuote) {
        throw createHttpError(
          StatusCodes.NOT_FOUND,
          `Quote with id ${quoteId} not found`
        );
      }
      if (!singleQuote.userId.equals(authenticatedUserId)) {
        throw createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You cannot access this note"
        );
      }
      res.status(StatusCodes.OK).json(singleQuote);
    } catch (error) {
      next(error);
    }
  }
);

// Update Quote
router.patch(
  "/:quoteId",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const { category, quote } = req.body;
    const authenticatedUserId = req.session.userId;
    try {
      assertIsDefined(authenticatedUserId);
      if (!mongoose.isValidObjectId(quoteId)) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid quote id");
      }
      if (!category || !quote) {
        throw createHttpError(
          StatusCodes.BAD_REQUEST,
          "Fields Cannot be empty"
        );
      }
      const singleQuote = await quotesService.getSingleQuotebyId(quoteId);
      if (!singleQuote) {
        throw createHttpError(
          StatusCodes.NOT_FOUND,
          `Quote with id ${quoteId} not found`
        );
      }
      // Checking whether the Quote that is being updated is his own Quote
      if (!singleQuote.userId.equals(authenticatedUserId)) {
        throw createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You cannot access this note"
        );
      }
      const updatedQuote = await quotesService.updateQuote(quoteId, {
        quote,
        category,
      });
      res.status(StatusCodes.OK).json(updatedQuote);
    } catch (error) {
      next(error);
    }
  }
);

// Delete Quote
router.delete(
  "/:quoteId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const authenticatedUserId = req.session.userId;
    try {
      assertIsDefined(authenticatedUserId);
      if (!mongoose.isValidObjectId(quoteId)) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid Quote id");
      }
      const deletedQuote = await quotesService.deleteQuote(quoteId);
      if (!deletedQuote) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Quote not found");
      }
      // Checking whether the note that is being updated is his own note
      if (!deletedQuote.userId.equals(authenticatedUserId)) {
        throw createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You cannot access this quote"
        );
      }
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }
);

export { router as quotesRoutes };
