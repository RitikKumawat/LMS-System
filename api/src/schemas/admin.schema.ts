import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ADMIN_ROLES } from 'src/enum/roles';

export type AdminDocument = HydratedDocument<Admin>;
@Schema({ timestamps: true })
@ObjectType()
export class Admin {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true, unique: true })
  @Field(() => String)
  email: string;

  @Prop({ required: true })
  @Field()
  password: string;

  @Prop({ enum: ADMIN_ROLES, required: true })
  @Field(() => ADMIN_ROLES)
  role: ADMIN_ROLES;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
