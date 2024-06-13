// Core
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Modules
import { AppModule } from '../src/app.module';

describe('ProjectController (e2e)', () => {
  let app: INestApplication;
  let access_token: string;
  let projectId: string;
  let taskId: string;
  const projectDto = {
    title: 'Title',
    description:
      'New long description for  test project long New long description for  test project long ',
  };
  const taskDto = {
    title: 'new task',
    description: 'new task description',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new project', async () => {
    const authDto = {
      username: 'existinguser1',
      password: 'testpassword',
    };

    await request(app.getHttpServer()).post('/api/auth/register').send(authDto);

    const tokens = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(authDto);
    access_token = tokens.body.access_token;

    const response = await request(app.getHttpServer())
      .post('/api/projects')
      .set('Authorization', `Bearer ${access_token}`)
      .send(projectDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.description).toBe(projectDto.description);
    projectId = response.body._id;
  });

  it('should return 401 if not authorized when creating a project', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/projects')
      .send(projectDto)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 401 if not authorized when creating a task', async () => {
    const fakeProjectId = '666af7b9df95ad7c432977b2';

    const response = await request(app.getHttpServer())
      .post(`/api/projects/${fakeProjectId}/tasks`)
      .send(taskDto)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 404 if project does not exist when creating a task', async () => {
    const fakeProjectId = '666af7b9df95ad7c432977b2';

    const response = await request(app.getHttpServer())
      .post(`/api/projects/${fakeProjectId}/tasks`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(taskDto)
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body.message).toBe('Project with such id does not exists');
  });

  it('should return 404 if project does not exist when creating a task', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(taskDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('_id');
    taskId = response.body._id;
  });

  it('should update a task in a project', async () => {
    const updateTaskDto = {
      status: 'In-progress',
    };

    const response = await request(app.getHttpServer())
      .put(`/api/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(updateTaskDto)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('_id');
  });

  it('should return 401 if not authorized when updating a task', async () => {
    const fakeProjectId = '666af7b9df95ad7c432977b2';
    const fakeTaskId = 'abcdef1234567890';
    const updateTaskDto = {
      status: 'Completed',
    };

    const response = await request(app.getHttpServer())
      .put(`/api/projects/${fakeProjectId}/tasks/${fakeTaskId}`)
      .send(updateTaskDto)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 404 if project does not exist when updating a task', async () => {
    const fakeProjectId = '666af7b9df95ad7c432977b2';
    const fakeTaskId = 'abcdef1234567890';
    const updateTaskDto = {
      status: 'Completed',
    };

    const response = await request(app.getHttpServer())
      .put(`/api/projects/${fakeProjectId}/tasks/${fakeTaskId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(updateTaskDto)
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body.message).toBe('Project with such id does not exists');
  });

  it('should retrieve tasks of a project', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('should return 401 if not authorized when retrieving tasks', async () => {
    const fakeProjectId = '666af7b9df95ad7c432977b2';

    const response = await request(app.getHttpServer())
      .get(`/api/projects/${fakeProjectId}/tasks`)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 404 if project does not exist when retrieving tasks', async () => {
    const fakeProjectId = '666af7b9df95ad7c432977b2';

    const response = await request(app.getHttpServer())
      .get(`/api/projects/${fakeProjectId}/tasks`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body.message).toBe('Project with such id does not exists');
  });

  it('should delete a task in a project', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({});
  });

  it('should return 401 if not authorized when deleting a task', async () => {
    const fakeProjectId = '666af7b9df95ad7c432977b2';
    const fakeTaskId = 'abcdef1234567890';

    const response = await request(app.getHttpServer())
      .delete(`/api/projects/${fakeProjectId}/tasks/${fakeTaskId}`)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 404 if project does not exist when deleting a task', async () => {
    const fakeProjectId = '666af7b9df95ad7c432977b2';
    const fakeTaskId = 'abcdef1234567890';

    const response = await request(app.getHttpServer())
      .delete(`/api/projects/${fakeProjectId}/tasks/${fakeTaskId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body.message).toBe('Project with such id does not exists');
  });
});
