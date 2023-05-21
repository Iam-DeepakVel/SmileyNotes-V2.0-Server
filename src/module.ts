import "dotenv/config";
import express, { Application, NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import { notesRoutes } from "./notes/notes.routes";
import env from "./utils/validateEnv";
import cors from "cors";
import { authRoutes } from "./users/users.routes";
import MongoStore from "connect-mongo";
import session from "express-session";
import { requireAuth } from "./middlewares/auth";
import { quotesRoutes } from "./quotes/quotes.routes";

export class AppModule {
  constructor(public app: Application) {
    app.use(
      cors({
        origin: "http://localhost:3001",
        credentials: true,
      })
    );
    app.use(express.json());
    // Session Configuration
    app.use(
      session({
        secret: env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        store: MongoStore.create({
          mongoUrl: env.MONGO_URI,
        }),
      })
    );
    app.use(morgan("dev"));
    // Routes
    app.use("/api/v1/notes", requireAuth, notesRoutes);
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/quotes", quotesRoutes);
    
    // Route Not Found
    app.use((req: Request, res: Response, next: NextFunction) => {
      next(createHttpError(StatusCodes.NOT_FOUND, "Endpoint not Found"));
    });

    // Error Handling Middleware
    app.use(errorHandler);
  }

  async start() {
    const port = env.PORT || 8000;
    try {
      await mongoose.connect(env.MONGO_URI);
      this.app.listen(port, () =>
        console.log(`Server is listening on Port ${env.PORT}`)
      );
    } catch (error) {
      console.log(error);
    }
  }
}
