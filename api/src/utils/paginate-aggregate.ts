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
  page = 1,
  limit = 10,
): Promise<PaginatedResult<T>> {
  const skip = (page - 1) * limit;

  const pipeline = [
    ...basePipeline,

    {
      $facet: {
        docs: [{ $skip: skip }, { $limit: limit }],
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
    limit,
    page,
    totalPages: Math.ceil(totalDocs / limit),
    hasNextPage: page * limit < totalDocs,
    hasPrevPage: page > 1,
  };
}
