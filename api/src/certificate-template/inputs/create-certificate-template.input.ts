import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

@InputType()
export class CreateCertificateTemplateInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    fabric_json: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    background_url?: string;

    @Field(() => [String], { defaultValue: [] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    placeholders?: string[];
}
