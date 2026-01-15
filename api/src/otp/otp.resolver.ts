import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { OtpService } from './otp.service';
import { User } from 'src/schemas/user.schema';
import { Public } from 'src/decorators/public.decorator';
import { VerifyLoginOtpInput, VerifyOtpInput } from './dto/create-otp.input';
import { Response } from 'express';
import { AUTH_TYPE } from 'src/enum/authType';

@Resolver()
export class OtpResolver {
  constructor(private readonly otpService: OtpService) {}

  @Mutation(() => User)
  @Public()
  signUpOtpVerify(
    @Args('data') data: VerifyOtpInput,
    @Context() context: { res: Response },
  ) {
    return this.otpService.signupVerify(data, context.res);
  }
  @Mutation(() => User)
  @Public()
  loginOtpVerify(
    @Args('data') data: VerifyLoginOtpInput,
    @Context() context: { res: Response },
  ) {
    return this.otpService.loginOtpVerify(data, context.res);
  }

  @Mutation(() => String)
  @Public()
  sendOtp(@Args('email') email: string, @Args('type') type: AUTH_TYPE) {
    return this.otpService.sendOtp(email, type);
  }
}
