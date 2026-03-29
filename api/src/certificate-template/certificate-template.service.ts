import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CertificateTemplate,
  CertificateTemplateDocument,
} from '../schemas/certificate-template.schema';
import { CreateCertificateTemplateInput } from './inputs/create-certificate-template.input';
import { UpdateCertificateTemplateInput } from './inputs/update-certificate-template.input';
import { paginateAggregate } from '../utils/paginate-aggregate';
import { PaginatedResult } from '../utils/pagination.util';
import { PaginationInput } from '../category/pagination.dto';
import { PipelineStage } from 'mongoose';
import { CertificateTemplateResponse } from './entity/certificate-template.entity';
import { Request } from 'express';
import { ADMIN_ROLES } from 'src/enum/roles';

@Injectable()
export class CertificateTemplateService {
  constructor(
    @InjectModel(CertificateTemplate.name)
    private templateModel: Model<CertificateTemplateDocument>,
  ) {}

  async create(
    createInput: CreateCertificateTemplateInput,
    admin_id: string,
  ): Promise<CertificateTemplate> {
    const newTemplate = new this.templateModel({
      ...createInput,
      created_by: admin_id,
    });
    return newTemplate.save();
  }

  async findAll(
    paginationInput: PaginationInput,
    req: Request,
  ): Promise<PaginatedResult<CertificateTemplateResponse>> {
    const { page, limit } = paginationInput;

    const adminId = req.user.id;
    const isInstructor = req.user.roles === ADMIN_ROLES.INSTRUCTOR;

    const pipeline: PipelineStage[] = [];

    // Filter templates for instructor
    if (isInstructor) {
      pipeline.push({
        $match: {
          created_by: adminId,
        },
      });
    }

    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        createdAt: 1,
      },
    });

    return paginateAggregate<CertificateTemplateResponse>(
      this.templateModel,
      pipeline,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<CertificateTemplate> {
    const template = await this.templateModel.findById(id).exec();
    if (!template) {
      throw new NotFoundException(`Certificate template #${id} not found`);
    }
    return template;
  }

  async update(
    updateInput: UpdateCertificateTemplateInput,
  ): Promise<CertificateTemplate> {
    const { templateId, ...updateData } = updateInput;
    const existingTemplate = await this.templateModel
      .findByIdAndUpdate(templateId, updateData, { new: true })
      .exec();

    if (!existingTemplate) {
      throw new NotFoundException(
        `Certificate template #${templateId} not found`,
      );
    }
    return existingTemplate;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.templateModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Certificate template #${id} not found`);
    }
    return true;
  }
}
