import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import * as Validator from 'class-validator';

@InputType()
export class ProductWhereUniqueInput {

    @Field(() => String, {nullable:false})
    @Validator.IsNotEmpty()
    prodCd!: string;
}
