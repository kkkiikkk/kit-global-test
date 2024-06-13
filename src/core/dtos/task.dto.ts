// Core
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// Tools
import { TaskStatuses } from '../../db/entites/task.entity';

export class TaskDto {
  @ApiProperty({ example: 'Task Title', description: 'The title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Task Description',
    description: 'The description of the task',
  })
  @IsString()
  @MaxLength(500)
  @MinLength(50)
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskStatuses, description: 'The status of the task' })
  @IsEnum(TaskStatuses)
  @IsOptional()
  status?: TaskStatuses;
}

export class UpdateTaskDto extends PartialType(TaskDto) {}
