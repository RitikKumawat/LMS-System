import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateCertificateTemplateInput } from './create-certificate-template.input';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCertificateTemplateInput extends PartialType(CreateCertificateTemplateInput) {
    @Field(() => ID)
    @IsMongoId()
    @IsNotEmpty()
    id: string;
}
