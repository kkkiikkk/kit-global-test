// Core
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({
  versionKey: false,
})
export class User {
  @Prop({
    type: SchemaTypes.String,
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  password: string;
}

export type UserDocument = Document & User;
export const UserSchema = SchemaFactory.createForClass(User);
