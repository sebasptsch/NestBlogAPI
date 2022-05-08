import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard(
  'jwt',
) {
  async canActivate(context: ExecutionContext) {
    try {
      await super.canActivate(context);
    } catch (error) {
      if (
        error instanceof UnauthorizedException
      ) {
        return true;
      }
      console.log('error', error);
      // return true;
    }

    return true;
  }
}
