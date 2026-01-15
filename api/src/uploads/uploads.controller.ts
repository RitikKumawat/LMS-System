import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { Request } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/enum/roles';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('uploads')
@UseGuards(AuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Roles(ADMIN_ROLES.INSTRUCTOR)
  @Post('start')
  startUpload() {
    return this.uploadsService.createUploadSession();
  }

  @Roles(ADMIN_ROLES.INSTRUCTOR)
  @Post(':uploadId')
  async upload(@Param('uploadId') uploadId: string, @Req() req: Request) {
    return this.uploadsService.streamUpload(uploadId, req);
  }
}
