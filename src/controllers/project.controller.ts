// Core
import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  Param,
  NotFoundException,
  Put,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

// Tools
import { GetUsername } from 'src/core/decorators';
import { AccessGuard } from 'src/core/guards';
import { ProjectDto } from '../core/dtos/project.dto';
import { TaskStatuses } from '../db/entites/task.entity';
import { TaskDto, UpdateTaskDto } from '../core/dtos/task.dto';

// Services
import { ProjectService } from '../services/project/project.service';
import { TaskService } from '../services/task/task.service';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('api/projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
  ) {}

  @Post()
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBody({ type: ProjectDto })
  async create(
    @Body() projectDto: ProjectDto,
    @GetUsername() username: string,
  ) {
    return this.projectService.create(projectDto, username);
  }

  @Post('/:id/tasks')
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task in a project' })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Project with such id does not exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiBody({ type: TaskDto })
  async createTask(
    @Body() taskDto: TaskDto,
    @GetUsername() username: string,
    @Param('id') projectId: string,
  ) {
    await this.checkProjectExistence(projectId, username);

    return this.taskService.create(taskDto, projectId);
  }

  @Put('/:id/tasks/:taskId')
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a task in a project' })
  @ApiResponse({ status: 200, description: 'Task successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Project with such id does not exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  async updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUsername() username: string,
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    await this.checkProjectExistence(projectId, username);

    return this.taskService.update(updateTaskDto, taskId);
  }

  @Get('/:id/tasks')
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tasks of a project with filters and sorting' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Project with such id does not exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by task status',
  })
  async getTasks(
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc',
    @Query('status') status: TaskStatuses,
    @Param('id') projectId: string,
    @GetUsername() username: string,
  ) {
    await this.checkProjectExistence(projectId, username);

    return this.taskService.getTasksByProjectId(
      { status },
      { sortOrder, sortBy },
      projectId,
    );
  }

  @Delete('/:id/tasks/:taskId')
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task in a project' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Project with such id does not exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  async deleteTask(
    @GetUsername() username: string,
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    await this.checkProjectExistence(projectId, username);

    await this.taskService.delete(taskId);

    return {};
  }

  private async checkProjectExistence(projectId: string, username: string) {
    const project = await this.projectService.getProjectByIdAndUsername(
      projectId,
      username,
    );

    if (!project) {
      throw new NotFoundException('Project with such id does not exists');
    }
  }
}
