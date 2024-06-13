// Core
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({
  versionKey: false,
})
export class Project {
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  title: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  description: string;

  @Prop({
    type: SchemaTypes.ObjectId,
  })
  ownerId: string;
}

export type ProjectDocument = Document & Project;
export const ProjectSchema = SchemaFactory.createForClass(Project);
