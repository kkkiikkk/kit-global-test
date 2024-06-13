// Core
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Modules
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let refresh_token = '';
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

  it('should register a new user', async () => {
    const authDto = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(authDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.username).toBe(authDto.username);
  });

  it('should return 409 if username is already taken when registering', async () => {
    const authDto = {
      username: 'existinguser',
      password: 'testpassword',
    };

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(authDto)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(authDto)
      .expect(HttpStatus.CONFLICT);

    expect(response.body.message).toBe('Username is taken');
  });

  it('should login with correct credentials', async () => {
    const authDto = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(authDto)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
    refresh_token = response.body.refresh_token;
  });

  it('should return 404 if user not found when logging in', async () => {
    const authDto = {
      username: 'unknownuser',
      password: 'testpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(authDto)
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body.message).toBe('User not found');
  });

  it('should return 401 if user use wrong token for refreshing', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('Authorization', `Bearer wrong_token`)
      .send()
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 200 if user use wrong token for refreshing', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('Authorization', `Bearer ${refresh_token}`)
      .send()
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
  });
});
