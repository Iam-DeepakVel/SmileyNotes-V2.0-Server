import { RegisterUserDto } from "./dtos/users.dto";
import { User, UserModel } from "./users.model";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export class UserService {
  constructor(public userModel: UserModel) {}

  async register(registerUserDto: RegisterUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hashedPassword = await bcrypt.hash(registerUserDto.password!, 10);
    const user = await this.userModel.create({
      username: registerUserDto.username,
      email: registerUserDto.email,
      password: hashedPassword,
    });
    return user;
  }

  async findUserbyUsername(username: string) {
    const user = await this.userModel
      .findOne({ username })
      .select("+password +email")
      .exec();
    return user;
  }

  async findUserbyEmail(email: string) {
    const user = await this.userModel
      .findOne({ email })
      .select("+email")
      .exec();
    return user;
  }

  async findUserbyId(userId: mongoose.Types.ObjectId | undefined) {
    const user = await this.userModel.findById(userId).select("+email").exec();
    return user;
  }
}

export const userService = new UserService(User);
