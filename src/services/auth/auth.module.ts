// Core
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

// Services
import { AuthService } from './auth.service';

// Entities
import { UserSchema } from '../../db/entites/user.entity';

// Tools
import { AccessStrategy, RefreshStrategy } from '../../core/strategies';
import { AccessGuard, RefreshGuard } from '../../core/guards';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    AccessStrategy,
    RefreshStrategy,
    AccessGuard,
    RefreshGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
