import { NextFunction, Response, Router, Request } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { userService } from "./users.service";
import bcrypt from "bcrypt";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// current-user
router.get(
  "/current-user",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.findUserbyId(req.session.userId);
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// Register
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    try {
      if (!username || !email || !password) {
        throw createHttpError(
          StatusCodes.BAD_REQUEST,
          "Please enter the credentials!!"
        );
      }
      const existingUsername = await userService.findUserbyUsername(username);
      if (existingUsername) {
        throw createHttpError(
          StatusCodes.CONFLICT,
          "Username already taken! Please choose a different one or log in instead!"
        );
      }
      const existingEmail = await userService.findUserbyEmail(email);
      if (existingEmail) {
        throw createHttpError(
          StatusCodes.CONFLICT,
          "A user with this email address already exists. Please log in instead!"
        );
      }
      const newUser = await userService.register({ username, email, password });
      req.session.userId = newUser._id;
      res
        .status(StatusCodes.CREATED)
        .json({ username: newUser.username, email: newUser.email });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        throw createHttpError(
          StatusCodes.BAD_REQUEST,
          "Please provide the credentials"
        );
      }
      const user = await userService.findUserbyUsername(username);
      if (!user) {
        throw createHttpError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw createHttpError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
      }
      req.session.userId = user._id;
      res
        .status(StatusCodes.OK)
        .json({ username: user.username, email: user.email });
    }catch(error) {
      next(error);
    }
  }
);

// Logout
router.get(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((error) => {
      error ? next(error) : res.sendStatus(StatusCodes.OK);
    });
  }
);

export { router as authRoutes };
