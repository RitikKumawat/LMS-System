import { Injectable } from '@nestjs/common';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { UploadsGateway } from './uploads.gateway';

@Injectable()
export class UploadsService {
  constructor(private gateway: UploadsGateway) {}

  createUploadSession() {
    const uploadId = randomUUID();
    return {
      uploadId,
      uploadUrl: `/uploads/${uploadId}`,
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

    const videoUrl = `/uploads/videos/${uploadId}.mp4`;
    this.gateway.emitProgress(uploadId, 100, videoUrl);

    return { success: true, videoUrl };
  }
}
