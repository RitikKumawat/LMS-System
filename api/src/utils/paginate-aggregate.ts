// paginate-aggregate.ts
import { Model, PipelineStage } from 'mongoose';

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function paginateAggregate<T>(
  model: Model<any>,
  basePipeline: PipelineStage[], // aggregation without pagination
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResult<T>> {
  const validPage = Number(page) > 0 ? Number(page) : 1;
  const validLimit = Number(limit) > 0 ? Number(limit) : 10;

  const skip = (validPage - 1) * validLimit;

  const pipeline = [
    ...basePipeline,

    {
      $facet: {
        docs: [{ $skip: skip }, { $limit: validLimit }],
        totalDocs: [{ $count: 'count' }],
      },
    },
  ];

  const result = await model.aggregate(pipeline).exec();

  const docs: T[] = result[0]?.docs ?? [];
  const totalDocs = result[0]?.totalDocs[0]?.count ?? 0;

  return {
    docs,
    totalDocs,
    limit: validLimit,
    page: validPage,
    totalPages: Math.ceil(totalDocs / validLimit),
    hasNextPage: validPage * validLimit < totalDocs,
    hasPrevPage: validPage > 1,
  };
}
