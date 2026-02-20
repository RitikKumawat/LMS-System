import { Field, ID, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString, Length, Max, MaxLength, Min, MinLength } from "class-validator";

@InputType()
export class CreateQuizDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    title: string;

    @Field(() => Int)
    @IsNumber()
    @Min(0)
    @Max(100)
    passing_score: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    courseModuleId: string;

    @Field({ nullable: true })
    quizId?: string;
}
