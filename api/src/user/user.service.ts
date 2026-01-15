import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { CONSTANTS } from 'src/constants/index.constants';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
  ) {}
  async getProfileData(userId: string) {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new HttpException('Unauthorized Access', 403);
    }
    return user;
  }
  async userLogout(res: Response) {
    res.clearCookie(CONSTANTS.USER_TOKEN);
    return 'Logout Successful';
  }
}
