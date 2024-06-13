// Core
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Entities
import { UserDocument } from '../../db/entites/user.entity';
import { Project, ProjectDocument } from '../../db/entites/project.entity';

// Tools
import { ProjectDto } from '../../core/dtos/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project')
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(
    createProjectDto: ProjectDto,
    username: string,
  ): Promise<Project> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException('User with such username does not exists');
    }

    const newProject = new this.projectModel({
      ...createProjectDto,
      ownerId: user._id,
    });

    return await newProject.save();
  }

  async getProjectByIdAndUsername(
    id: string,
    username: string,
  ): Promise<Project> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException('User with such username does not exists');
    }

    return this.projectModel.findOne({ _id: id, ownerId: user._id });
  }
}
