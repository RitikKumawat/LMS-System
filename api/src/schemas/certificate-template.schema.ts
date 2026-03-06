import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CertificateElement } from '../certificate-engine/entities/certificate-element.entity';

export type CertificateTemplateDocument = HydratedDocument<CertificateTemplate>;

@Schema({ timestamps: true })
@ObjectType()
export class CertificateTemplate {
    @Field(() => ID)
    _id: string;

    @Prop({ required: true })
    @Field()
    name: string;

    @Prop({ type: String })
    @Field({ nullable: true })
    background_image?: string;

    @Prop({ type: [{ type: Object }], default: [] })
    @Field(() => [CertificateElement])
    elements: CertificateElement[];

    @Prop({ type: Types.ObjectId, ref: 'Admin', required: true })
    @Field(() => ID)
    created_by: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

export const CertificateTemplateSchema = SchemaFactory.createForClass(CertificateTemplate);
