import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorResolver } from './instructor.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature(SCHEMAS),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret') ?? 'fallbackSecretKey',
        signOptions: {
          expiresIn: '365d',
        },
      }),
    }),
  ],
  providers: [InstructorResolver, InstructorService],
  exports: [InstructorService],
})
export class InstructorModule {}
