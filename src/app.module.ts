// Core
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Config
import { authConfig, serverConfig, dbConfig } from './config';

// Modules
import { DbModule } from './db/db.module';
import { AuthModule } from './services/auth/auth.module';
import { ProjectModule } from './services/project/project.module';
import { TaskModule } from './services/task/task.module';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { ProjectController } from './controllers/project.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, serverConfig, dbConfig],
    }),
    DbModule,
    AuthModule,
    ProjectModule,
    TaskModule,
  ],
  controllers: [AuthController, ProjectController],
})
export class AppModule {}
