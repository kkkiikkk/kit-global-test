// Core
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// Tools
import { STRATEGY } from '../../utils';

@Injectable()
export class RefreshGuard extends AuthGuard(STRATEGY.REFRESH) {
  constructor() {
    super();
  }
}
