// Core
import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

// Tools
import { GetUsername } from '../core/decorators';
import { RefreshGuard } from '../core/guards';
import { AuthDto } from '../core/dtos/auth.dto';

// Services
import { AuthService } from '../services/auth/auth.service';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'Username is taken' })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBody({ type: AuthDto })
  async register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Invalid password entered' })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBody({ type: AuthDto })
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access is denied' })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth()
  refresh(
    @GetUsername()
    username: string,
  ) {
    return this.authService.refresh(username);
  }
}
