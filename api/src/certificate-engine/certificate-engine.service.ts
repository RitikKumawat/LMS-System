import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CertificateTemplate, CertificateTemplateDocument } from '../schemas/certificate-template.schema';
import { CreateCertificateTemplateInput } from './inputs/create-certificate-template.input';
import { UpdateCertificateTemplateInput } from './inputs/update-certificate-template.input';

@Injectable()
export class CertificateEngineService {
    constructor(
        @InjectModel(CertificateTemplate.name)
        private certificateTemplateModel: Model<CertificateTemplateDocument>,
    ) { }

    async create(createInput: CreateCertificateTemplateInput, adminId: string): Promise<CertificateTemplate> {
        const newTemplate = new this.certificateTemplateModel({
            ...createInput,
            created_by: adminId,
        });
        return newTemplate.save();
    }

    async findAll(): Promise<CertificateTemplate[]> {
        return this.certificateTemplateModel.find().exec();
    }

    async findOne(id: string): Promise<CertificateTemplate> {
        const template = await this.certificateTemplateModel.findById(id).exec();
        if (!template) {
            throw new NotFoundException(`Certificate Template with ID ${id} not found`);
        }
        return template;
    }

    async update(id: string, updateInput: UpdateCertificateTemplateInput): Promise<CertificateTemplate> {
        const existingTemplate = await this.certificateTemplateModel
            .findByIdAndUpdate(id, updateInput, { new: true })
            .exec();

        if (!existingTemplate) {
            throw new NotFoundException(`Certificate Template with ID ${id} not found`);
        }
        return existingTemplate;
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.certificateTemplateModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Certificate Template with ID ${id} not found`);
        }
        return true;
    }
}
