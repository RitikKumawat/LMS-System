import {
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';
import { AdminLoginDto, CreateInstructorDto } from './dto/admin.dto';
import * as bcrypt from 'bcrypt';
import { ADMIN_ROLES } from 'src/enum/roles';
import { CONSTANTS } from 'src/constants/index.constants';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly AdminModel: Model<AdminDocument>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createInstructor(
    input: CreateInstructorDto,
  ): Promise<Omit<Admin, 'password'>> {
    const { name, email, password } = input;
    const existingAdmin = await this.AdminModel.findOne({ email }).exec();
    if (existingAdmin) {
      throw new ConflictException('An admin with this email already exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new this.AdminModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedAdmin = await newAdmin.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = savedAdmin.toObject();
    delete result.password;
    return result;
  }

  async adminLogin(
    input: AdminLoginDto,
    res: Response,
  ): Promise<Omit<Admin, 'password'>> {
    const { email, password } = input;

    const admin = await this.AdminModel.findOne({ email }).exec();
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    let token;
    if (admin.role === ADMIN_ROLES.INSTRUCTOR) {
      token = this.jwtService.sign(
        {
          id: admin._id,
          email: admin.email,
          roles: ADMIN_ROLES.INSTRUCTOR,
          name: admin.name,
        },
        {
          secret:
            this.configService.get<string>('jwt.secret') ?? 'fallbackSecretKey',
          expiresIn: '365d',
        },
      );
    }
    if (admin.role === ADMIN_ROLES.ADMIN) {
      token = this.jwtService.sign(
        {
          id: admin._id,
          email: admin.email,
          roles: ADMIN_ROLES.ADMIN,
          name: admin.name,
        },
        {
          secret:
            this.configService.get<string>('jwt.secret') ?? 'fallbackSecretKey',
          expiresIn: '365d',
        },
      );
    }
    res.cookie(CONSTANTS.ADMIN_TOKEN, token, {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'none',
    });
    const result = admin.toObject();
    delete result.password;
    return result;
  }

  async getAdminData(adminId: string) {
    const admin = await this.AdminModel.findById(adminId);
    if (!admin) {
      throw new HttpException('Unauthorized Access', 403);
    }
    delete admin.password;
    return admin;
  }

  async createDefaultAdmin() {
    const existingAdmin = await this.AdminModel.findOne({
      role: ADMIN_ROLES.ADMIN,
    });

    if (existingAdmin) {
      console.log('Admin already exists, skipping creation.');
      return;
    }

    const password = await bcrypt.hash('Admin@1640', 10);
    const admin = await this.AdminModel.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password,
      role: ADMIN_ROLES.ADMIN,
    });

    console.log('Default admin created:', admin.email);
  }

  async adminLogout(res: Response) {
    res.clearCookie(CONSTANTS.ADMIN_TOKEN);
    res.clearCookie(CONSTANTS.INSTRUCTOR_TOKEN);
    return 'Logout Successful';
  }
}
