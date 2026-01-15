import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNumberString, Length } from 'class-validator';

@InputType()
export class VerifyOtpInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field()
  name: string;

  @Field()
  @IsNumberString({}, { message: 'OTP must contain only numbers' })
  @Length(6, 6, { message: 'OTP must be 6 digits long' })
  otp: string;
}

@InputType()
export class VerifyLoginOtpInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field()
  @IsNumberString({}, { message: 'OTP must contain only numbers' })
  @Length(6, 6, { message: 'OTP must be 6 digits long' })
  otp: string;
}
