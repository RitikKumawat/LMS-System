import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { UploadsGateway } from './uploads.gateway';

@Injectable()
export class UploadsService {
  constructor(
    private gateway: UploadsGateway,
    private configService: ConfigService,
  ) { }

  createUploadSession() {
    const uploadId = randomUUID();
    const baseUrl = this.configService.get('app.baseUrl');
    return {
      uploadId,
      uploadUrl: `${baseUrl}/uploads/${uploadId}`,
    };
  }

  async streamUpload(uploadId: string, req: Request) {
    const dir = './uploads/videos';
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const filePath = join(dir, `${uploadId}.mp4`);
    const stream = createWriteStream(filePath);

    let uploaded = 0;
    const total = Number(req.headers['content-length']);

    req.on('data', (chunk) => {
      uploaded += chunk.length;
      const percent = Math.round((uploaded / total) * 100);
      this.gateway.emitProgress(uploadId, percent);
    });

    req.pipe(stream);

    await new Promise<void>((resolve, reject) => {
      stream.on('finish', () => resolve());
      stream.on('error', (err) => reject(err));
    });

    const baseUrl = this.configService.get('app.baseUrl');
    const videoUrl = `${baseUrl}/uploads/videos/${uploadId}.mp4`;
    this.gateway.emitProgress(uploadId, 100, videoUrl);

    return { success: true, videoUrl };
  }
}
