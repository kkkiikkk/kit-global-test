// Core
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Tools
import { ENV, STRATEGY } from '../../utils';
import { IJwtPayload, IJwtPayloadRefresh } from '../interfaces/auth';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  STRATEGY.REFRESH,
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: <string>config.get(ENV[ENV.REFRESH_SECRET]),
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: IJwtPayload): IJwtPayloadRefresh {
    const refreshToken = request
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
