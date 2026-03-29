import {
  Controller,
  Get,
  Headers,
  Param,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createReadStream, statSync } from 'fs';
import { Roles } from 'src/decorators/roles.decorator';
import { USER_ROLES } from 'src/enum/roles';
import { CertificateGenerationService } from './certificate-generation.service';

@Controller('certificates')
export class CertificateDownloadController {
  constructor(
    private readonly certificateGenerationService: CertificateGenerationService,
  ) {}

  @Get('download/:courseId')
  @Roles(USER_ROLES.USER)
  async downloadCertificate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('courseId') courseId: string,
    @Headers('range') range?: string,
  ): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context not found');
    }

    const { filePath, fileName } =
      await this.certificateGenerationService.getUserCertificateDownloadDetails(
        userId,
        courseId,
      );

    const fileStat = statSync(filePath);
    const fileSize = fileStat.size;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Accept-Ranges', 'bytes');

    if (range) {
      const byteRange = range.replace(/bytes=/, '').split('-');
      const start = Number(byteRange[0]);
      const end = byteRange[1] ? Number(byteRange[1]) : fileSize - 1;

      if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start > end ||
        start >= fileSize
      ) {
        res.status(416).setHeader('Content-Range', `bytes */${fileSize}`).end();
        return;
      }

      const safeEnd = Math.min(end, fileSize - 1);
      const chunkSize = safeEnd - start + 1;

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${safeEnd}/${fileSize}`);
      res.setHeader('Content-Length', chunkSize.toString());

      createReadStream(filePath, { start, end: safeEnd }).pipe(res);
      return;
    }

    res.status(200);
    res.setHeader('Content-Length', fileSize.toString());

    createReadStream(filePath).pipe(res);
  }
}
