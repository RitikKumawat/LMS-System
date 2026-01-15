import { Types, FilterQuery } from 'mongoose';
import { HttpException } from '@nestjs/common';

/**
 * Validates that a slug is unique in the given model.
 * @param model - Mongoose model to check against
 * @param slug - The slug to validate
 * @param documentId - Optional document ID to exclude from the check (for updates)
 */
export const validateSlugUniqueness = async (
  model: any,
  slug: string,
  documentId?: string,
): Promise<void> => {
  const query: FilterQuery<any> = { slug };

  if (documentId) {
    query._id = { $ne: new Types.ObjectId(documentId) };
  }

  const exists = await model.findOne(query);

  if (exists) {
    throw new HttpException(`Slug "${slug}" already exists.`, 400);
  }
};
