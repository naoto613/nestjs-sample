import { registerEnumType } from '@nestjs/graphql';

export enum UserScalarFieldEnum {
    id = "id",
    email = "email",
    name = "name",
    password = "password",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    authority = "authority",
    hashedRefreshToken = "hashedRefreshToken"
}


registerEnumType(UserScalarFieldEnum, { name: 'UserScalarFieldEnum', description: undefined })
