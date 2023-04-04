import mongoose from "mongoose";
import { createQuoteDto, UpdateQuoteDto } from "./dtos/quotes.dto";
import { Quote, QuoteModel } from "./quotes.model";

export class QuotesService {
  constructor(private quoteModel: QuoteModel) {}

  async addQuote(createQuoteDto: createQuoteDto) {
    const newQuote = await this.quoteModel.create({
      userId: createQuoteDto.userId,
      quote: createQuoteDto.quote,
      category: createQuoteDto.category,
    });
    return newQuote;
  }

  async getAllQuotes() {
    const allQuotes = await this.quoteModel.find({}).populate("userId").exec();
    return allQuotes;
  }

  async getLoggedinUserQuotes(userId: mongoose.Types.ObjectId | undefined) {
    const loggedinUserQuotes = this.quoteModel.find({ userId }).exec();
    return loggedinUserQuotes;
  }

  async getSingleQuotebyId(quoteId: string) {
    const singleQuote = await this.quoteModel.findById(quoteId);
    return singleQuote;
  }

  async updateQuote(quoteId: string, updateQuoteDto: UpdateQuoteDto) {
    const updatedQuote = await this.quoteModel.findOneAndUpdate(
      { _id: quoteId },
      {
        quote: updateQuoteDto.quote,
        category: updateQuoteDto.category,
      },
      {
        new: true,
      }
    );
    return updatedQuote;
  }

  async deleteQuote(quoteId: string) {
    return await this.quoteModel.findByIdAndRemove(quoteId).exec();
  }
}

export const quotesService = new QuotesService(Quote);
