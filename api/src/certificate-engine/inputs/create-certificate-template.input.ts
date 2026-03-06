import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CertificateElementInput } from './certificate-element.input';

@InputType()
export class CreateCertificateTemplateInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    background_image?: string;

    @Field(() => [CertificateElementInput], { nullable: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CertificateElementInput)
    @IsOptional()
    elements?: CertificateElementInput[];
}
