import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class CreateInstructorDto {
  @Field()
  @IsString({ message: 'Name must be a string' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Field()
  @IsStrongPassword({}, { message: 'Password is not strong enough' })
  password: string;
}

@InputType()
export class AdminLoginDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}
