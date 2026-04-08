import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Paginated } from '../utils/pagination.util';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CertificateTemplateResponse } from 'src/certificate-template/entity/certificate-template.entity';

export type CertificateTemplateDocument = HydratedDocument<CertificateTemplate>;

@Schema({ timestamps: true })
@ObjectType()
export class CertificateTemplate {
    @Field(() => ID)
    _id: string;

    @Prop({ required: true })
    @Field()
    name: string;

    @Prop({ required: true, type: String })
    @Field()
    fabric_json: string; // The fabric.js workspace JSON

    @Prop({ type: String, default: null })
    @Field({ nullable: true })
    background_url?: string;

    @Prop({ type: [String], default: [] })
    @Field(() => [String], { defaultValue: [] })
    placeholders: string[];

    // FK: User who created the template
    @Prop({ type: Types.ObjectId, ref: 'Admin', required: true })
    @Field(() => ID)
    created_by: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

export const CertificateTemplateSchema = SchemaFactory.createForClass(CertificateTemplate);

@ObjectType()
export class PaginatedCertificateTemplate extends Paginated(CertificateTemplateResponse) { }
