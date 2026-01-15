import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstructorSignUpDto } from './dto/instructor.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';
import { ADMIN_ROLES } from 'src/enum/roles';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InstructorService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async instructorSignUp(
    input: InstructorSignUpDto,
  ): Promise<Omit<Admin, 'password'>> {
    const { name, email, password } = input;

    const existingInstructor = await this.adminModel.findOne({ email }).exec();
    if (existingInstructor) {
      throw new ConflictException(
        'An instructor with this email already exists.',
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newInstructor = new this.adminModel({
      name,
      email,
      password: hashedPassword,
      role: ADMIN_ROLES.INSTRUCTOR,
    });

    const savedInstructor = await newInstructor.save();
    const result = savedInstructor.toObject();
    delete result.password;
    return result;
  }
}
