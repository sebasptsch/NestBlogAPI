import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

@Injectable()
export class GQLSessionGuard
  implements CanActivate
{
  async canActivate(context: ExecutionContext) {
    const ctx =
      GqlExecutionContext.create(context);
    const request = ctx.getContext()
      .req as Request;

    return request.isAuthenticated();
  }
}
