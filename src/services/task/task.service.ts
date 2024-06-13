// Core
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Entities
import { Task, TaskDocument } from '../../db/entites/task.entity';

// Tools
import { TaskDto, UpdateTaskDto } from '../../core/dtos/task.dto';
import { IQuerySort } from '../../core/interfaces';
import { IQueryTaskFilters } from '../../core/interfaces/task';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task')
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: TaskDto, projectId: string): Promise<Task> {
    const newTask = new this.taskModel({ ...createTaskDto, projectId });

    return await newTask.save();
  }

  async update(updateTaskDto: UpdateTaskDto, taskId: string) {
    const task = await this.taskModel.findByIdAndUpdate(taskId, updateTaskDto);

    if (!task) {
      throw new NotFoundException('Task with such id does not exists');
    }

    return task;
  }

  async getTasksByProjectId(
    filter: IQueryTaskFilters,
    sort: IQuerySort,
    projectId: string,
  ) {
    const filterConditions = { projectId };
    if (filter.status) {
      filterConditions['status'] = filter.status;
    }

    const sortConditions = {};
    if (sort.sortBy) {
      sortConditions[sort.sortBy] = sort.sortOrder === 'desc' ? -1 : 1;
    }

    return this.taskModel.find(filterConditions).sort(sortConditions);
  }

  async delete(taskId: string) {
    const task = this.taskModel.findById(taskId);

    if (!task) {
      throw new NotFoundException('Task with such id not found');
    }

    this.taskModel.findByIdAndDelete(taskId);
  }
}
