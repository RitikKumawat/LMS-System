import { Model } from 'mongoose';

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

import { Field, Int, ObjectType } from '@nestjs/graphql';

export function Paginated<TItem>(ItemType: new () => TItem) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [ItemType])
    docs: TItem[];

    @Field(() => Int)
    totalDocs: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int)
    totalPages: number;

    @Field(() => Int)
    page: number;

    @Field(() => Boolean)
    hasNextPage: boolean;

    @Field(() => Boolean)
    hasPrevPage: boolean;
  }
  return PaginatedType;
}

export const paginate = async <T>(
  model: Model<any>, // ✅ accept ANY mongoose model
  page = 1,
  limit = 10,
  query: object = {},
): Promise<PaginatedResult<T>> => {
  const skip = (page - 1) * limit;

  const totalDocs = await model.countDocuments(query);

  const docs = await model
    .find(query)
    .skip(skip)
    .limit(limit)
    .lean<T[]>() // ✅ convert documents → T
    .exec();

  return {
    docs,
    totalDocs,
    limit,
    totalPages: Math.ceil(totalDocs / limit),
    page,
    hasNextPage: page * limit < totalDocs,
    hasPrevPage: page > 1,
  };
};
