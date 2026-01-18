import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from 'src/schemas/otp.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { VerifyLoginOtpInput, VerifyOtpInput } from './dto/create-otp.input';
import { AUTH_TYPE } from 'src/enum/authType';
import { USER_ROLES } from 'src/enum/roles';
import { Response } from 'express';
import { CONSTANTS } from 'src/constants/index.constants';
import { ConfigService } from '@nestjs/config';
import sendOtpUtils from 'src/utils/sendOtp.utils';
import createOtpUtils from 'src/utils/createOtp.utils';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private readonly OtpModel: Model<OtpDocument>,
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signupVerify(data: VerifyOtpInput, res: Response) {
    const existingUser = await this.UserModel.exists({
      email: data.email,
    });
    if (existingUser) {
      throw new HttpException('User already exists', 409);
    }
    const existingOtp = await this.OtpModel.findOne({
      email: data.email,
      otp: data.otp,
      type: AUTH_TYPE.SIGNUP,
    }).exec();
    if (!existingOtp) {
      throw new HttpException(' Invalid Otp', 409);
    }

    const otpExpiryTime =
      new Date(existingOtp.updateTime).getTime() + 20 * 60 * 1000;
    const currentTime = Date.now();

    if (currentTime > otpExpiryTime) {
      await this.OtpModel.deleteOne({
        email: data.email,
        otp: data.otp,
      });
      throw new HttpException('OTP expired', 410);
    }

    await this.OtpModel.findOneAndDelete({
      email: data.email,
      otp: data.otp,
    });
    const user = await this.UserModel.create({
      email: data.email,
      name: data.name,
    });
    const token = this.jwtService.sign(
      {
        id: user._id,
        email: user.email,
        roles: USER_ROLES.USER,
        name: user.name,
      },
      {
        secret:
          this.configService.get<string>('jwt.secret') ?? 'fallbackSecretKey',
        expiresIn: '365d',
      },
    );

    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    res.cookie(CONSTANTS.USER_TOKEN, token, {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'none',
    });

    return user;
  }

  async loginOtpVerify(data: VerifyLoginOtpInput, res: Response) {
    const user = await this.UserModel.findOne({
      email: data.email.toLowerCase().trim(),
    });
    if (!user) {
      throw new HttpException('Account not found', 400);
    }
    const existingOtp = await this.OtpModel.findOne({
      email: user.email,
      otp: data.otp,
      type: AUTH_TYPE.LOGIN,
    }).exec();
    if (!existingOtp) {
      throw new HttpException('Invalid Otp', 409);
    }
    const otpExpiryTime =
      new Date(existingOtp.updateTime).getTime() + 20 * 60 * 1000;
    const currentTime = Date.now();

    if (currentTime > otpExpiryTime) {
      await this.OtpModel.deleteOne({
        email: user.email,
        otp: data.otp,
      });
      throw new HttpException('OTP expired', 410);
    }

    await this.OtpModel.findOneAndDelete({
      email: user.email,
      otp: data.otp,
    });

    const token = this.jwtService.sign(
      {
        id: user._id,
        email: user.email,
        roles: USER_ROLES.USER,
        name: user.name,
      },
      {
        secret:
          this.configService.get<string>('jwt.secret') ?? 'fallbackSecretKey',
        expiresIn: '365d',
      },
    );

    if (!user.emailVerified) {
      user.emailVerified = true;
    }

    res.cookie(CONSTANTS.USER_TOKEN, token, {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'none',
    });

    return user;
  }

  async sendOtp(email: string, type: AUTH_TYPE) {
    const existingUser = await this.UserModel.exists({
      email: email.toLowerCase().trim(),
    }).exec();
    console.log('Existing user', existingUser);
    console.log('TYPE', type);
    if (existingUser && AUTH_TYPE[type] === AUTH_TYPE.SIGNUP) {
      throw new HttpException('This email is already registered', 400);
    }

    if (!existingUser && AUTH_TYPE[type] === AUTH_TYPE.LOGIN) {
      throw new HttpException('This email is not registered', 400);
    }

    const otpData = await this.OtpModel.findOneAndUpdate(
      {
        email: email,
        type: type,
      },
      { $set: { updateTime: new Date() } },
    );

    if (!otpData) {
      const otp = createOtpUtils();
      const newOtp = await this.OtpModel.create({
        otp: otp,
        email: email,
        type: type,
        updateTime: new Date(),
      });
      await sendOtpUtils(email, newOtp.otp);
      return 'Otp sent to your email';
    }

    await sendOtpUtils(email, otpData.otp);

    return 'Otp sent to your email';
  }
}
