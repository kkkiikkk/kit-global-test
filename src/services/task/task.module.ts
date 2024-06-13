// Core
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Services
import { TaskService } from './task.service';

// Entities
import { TaskSchema } from '../../db/entites/task.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }])],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
