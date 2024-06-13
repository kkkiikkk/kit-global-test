// Core
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from "mongoose";

@Schema()
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

export const UserDocument = Document<User>;
