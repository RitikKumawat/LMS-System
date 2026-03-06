import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CertificateElement {
    @Field(() => String)
    id: string;

    @Field(() => String)
    type: string;

    @Field(() => String)
    text: string;

    @Field(() => Float)
    x: number;

    @Field(() => Float)
    y: number;

    @Field(() => Float)
    fontSize: number;

    @Field(() => String)
    fontFamily: string;

    @Field(() => String)
    color: string;
}
