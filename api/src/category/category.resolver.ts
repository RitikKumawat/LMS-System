import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/enum/roles';
import { Category } from 'src/schemas/category.schema';
import { CreateCategoryInput, PaginatedCategory } from './dto/category.dto';
import { PaginationInput } from './pagination.dto';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  @Roles(ADMIN_ROLES.ADMIN)
  async createCategory(
    @Context() ctx,
    @Args('input') input: CreateCategoryInput,
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image?: FileUpload,
  ): Promise<Category> {
    return this.categoryService.createCategory(ctx.req, input, image);
  }

  @Roles(ADMIN_ROLES.ADMIN)
  @Query(() => Category, { name: 'category' })
  async getCategoryById(@Args('id') id: string): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  @Query(() => PaginatedCategory)
  async getAllCategories(
    @Args('paginationInput') paginationInput: PaginationInput,
  ) {
    return this.categoryService.getAllCategories(paginationInput);
  }
}
