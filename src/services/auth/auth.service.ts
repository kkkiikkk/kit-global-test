// Core
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

// Entities
import { User, UserDocument } from '../../db/entites/user.entity';

// Tools
import { AuthDto } from '../../core/dtos/auth.dto';
import { IJwtPayload, ITokens } from '../../core/interfaces/auth';
import { ENV } from '../../utils';

@Injectable()
export class AuthService {
  private readonly JwtAccessExpireTime = '10m';
  private readonly JwtRefreshExpireTime = '25m';

  constructor(
    private readonly configService: ConfigService,
    private readonly jwt: JwtService,
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async register(authDto: AuthDto): Promise<User> {
    if (await this.userModel.findOne({ username: authDto.username })) {
      throw new ConflictException('Username is taken');
    }
    const hashedPassword = await bcrypt.hash(authDto.password, 10);
    const newUser = new this.userModel({
      ...authDto,
      password: hashedPassword,
    });
    return await newUser.save();
  }

  async login(authDto: AuthDto): Promise<ITokens> {
    const user = await this.userModel.findOne({
      username: authDto.username,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(authDto.password, user.password))) {
      throw new UnauthorizedException('Invalid password entered');
    }

    return await this.generateTokens({
      username: user.username,
    });
  }

  async refresh(username: string): Promise<ITokens> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new ForbiddenException('Access is denied');
    }

    return await this.generateTokens({
      username: user.username,
    });
  }

  private async generateTokens(payload: IJwtPayload): Promise<ITokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.configService.get<string>(ENV[ENV.ACCESS_SECRET]),
        expiresIn: this.JwtAccessExpireTime,
      }),
      this.jwt.signAsync(payload, {
        secret: this.configService.get<string>(ENV[ENV.REFRESH_SECRET]),
        expiresIn: this.JwtRefreshExpireTime,
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
