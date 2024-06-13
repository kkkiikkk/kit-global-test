// Core
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export enum TaskStatuses {
  NEW = 'New',
  IN_PROGRESS = 'In-progress',
  COMPLETED = 'Completed',
}

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Task {
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  title: string;

  @Prop({
    type: SchemaTypes.String,
  })
  description: string;

  @Prop({
    type: SchemaTypes.String,
    enum: [...Object.values(TaskStatuses)],
    default: TaskStatuses.NEW,
  })
  status: TaskStatuses;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'Project',
  })
  projectId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  performerId: string;
}

export type TaskDocument = Document & Task;
export const TaskSchema = SchemaFactory.createForClass(Task);
