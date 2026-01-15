import { HttpException } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';

export async function validateFileUpload(
  file: FileUpload,
  allowedExtensions: string[], // ['.jpg', '.jpeg', '.png', '.webp']
  maxSize = 2 * 1024 * 1024, // 2MB default
): Promise<void> {
  if (!file) {
    throw new HttpException('No file provided', 400);
  }

  // /* ✅ 1. Validate by file extension (MOST reliable for GraphQL uploads) */
  // const extension = extname(file.filename).toLowerCase();

  // if (!allowedExtensions.includes(extension)) {
  //   throw new HttpException(
  //     `Invalid file type. Only ${allowedExtensions.join(', ')} are allowed.`,
  //     400,
  //   );
  // }

  /* ✅ 2. Soft mimetype validation (do NOT block octet-stream) */
  // const allowedMimeTypes = [
  //   'image/jpeg',
  //   'image/png',
  //   'image/webp',
  //   'application/octet-stream', // GraphQL fallback
  // ];

  if (file.mimetype && !allowedExtensions.includes(file.mimetype)) {
    throw new HttpException(`Invalid file mimetype: ${file.mimetype}`, 400);
  }

  /* ✅ 3. Streamed file size validation (memory-safe) */
  const stream = file.createReadStream();
  let fileSize = 0;

  await new Promise<void>((resolve, reject) => {
    stream.on('data', (chunk) => {
      fileSize += chunk.length;

      if (fileSize > maxSize) {
        stream.destroy();
        reject(
          new HttpException(
            `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
            400,
          ),
        );
      }
    });

    stream.on('end', () => resolve());
    stream.on('error', reject);
  });
}
