import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CertificateTemplateResponse {
    @Field(() => ID)
    _id: string;

    @Field()
    name: string;

    @Field(() => Date)
    createdAt: Date;
}

