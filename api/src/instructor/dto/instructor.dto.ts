import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class InstructorSignUpDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({}, { message: 'Password is not strong enough' })
  password: string;
}

@InputType()
export class InstructorLoginDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}
