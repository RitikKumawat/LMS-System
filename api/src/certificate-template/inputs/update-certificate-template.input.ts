import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateCertificateTemplateInput } from './create-certificate-template.input';

@InputType()
export class UpdateCertificateTemplateInput extends PartialType(CreateCertificateTemplateInput) {
    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    templateId: string;
}
