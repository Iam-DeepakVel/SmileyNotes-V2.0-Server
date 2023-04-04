import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    next(createHttpError(StatusCodes.UNAUTHORIZED, "User not authenticated"));
  }
};
