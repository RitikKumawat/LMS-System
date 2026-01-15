import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { CreateCategoryInput } from './dto/category.dto';
import { Request } from 'express';
import { generateFileUrl } from 'src/utils/generateFileUrl.util';
import { validateFileUpload } from 'src/utils/checkFileValidation';
import { generateSlug } from 'src/utils/slug.util';
import { validateSlugUniqueness } from 'src/utils/validateSlugUniqueness.utils';
import { PaginatedResult, paginate } from 'src/utils/pagination.util';
import { PaginationInput } from './pagination.dto';
import { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async createCategory(
    req: Request,
    input: CreateCategoryInput,
    image?: FileUpload,
  ): Promise<Category> {
    const slug = generateSlug(input.name);

    await validateSlugUniqueness(this.categoryModel, slug, input.categoryId);

    const categoryDetails: Partial<Category> = {
      name: input.name,
      slug: slug,
    };

    if (image) {
      await validateFileUpload(
        image,
        ['.jpeg', '.png', '.webp', '.jpg'],
        10 * 1024 * 1024,
      );
      categoryDetails.imageUrl = generateFileUrl(req, image, 'category-logo');
    } else if (input.imageUrl) {
      categoryDetails.imageUrl = input.imageUrl;
    }

    try {
      if (input.categoryId) {
        const category = await this.categoryModel.findByIdAndUpdate(
          new Types.ObjectId(input.categoryId),
          { $set: categoryDetails },
          { new: true, runValidators: true },
        );

        if (!category) {
          throw new HttpException('Category not found', 404);
        }

        return category;
      } else {
        const category = await this.categoryModel.create(categoryDetails);
        return category;
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to ${input.categoryId ? 'update' : 'create'} category: ${error.message}`,
        500,
      );
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(new Types.ObjectId(id));
    if (!category) {
      throw new HttpException('Category not found', 404);
    }
    return category;
  }

  async getAllCategories(
    paginationInput: PaginationInput,
  ): Promise<PaginatedResult<Category>> {
    return paginate<Category>(
      this.categoryModel,
      paginationInput.page,
      paginationInput.limit,
    );
  }
}
