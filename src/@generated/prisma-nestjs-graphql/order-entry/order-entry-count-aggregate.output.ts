import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';

@ObjectType()
export class OrderEntryCountAggregate {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    makerCd!: number;

    @HideField()
    createdAt!: number;

    @HideField()
    updatedAt!: number;

    @Field(() => Int, {nullable:false})
    _all!: number;
}
