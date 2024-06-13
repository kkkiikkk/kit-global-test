// Core
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Services
import { ProjectService } from './project.service';

// Entities
import { UserSchema } from '../../db/entites/user.entity';
import { ProjectSchema } from '../../db/entites/project.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Project', schema: ProjectSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
