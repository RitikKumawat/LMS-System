import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/utils/pagination.util';
import { Category } from 'src/schemas/category.schema';

@InputType()
export class CreateCategoryInput {
  @Field({ nullable: true })
  categoryId: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  imageUrl: string;
}

@ObjectType()
export class PaginatedCategory extends Paginated(Category) {}
