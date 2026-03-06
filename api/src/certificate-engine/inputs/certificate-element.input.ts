import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CertificateElementInput {
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
