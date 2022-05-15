import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecaptchaGuard
  implements CanActivate
{
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { body } = context
      .switchToHttp()
      .getRequest();

    const response = await this.httpService.post<{
      success: boolean;
    }>(
      `https://www.google.com/recaptcha/api/siteverify?response=${
        body.captchaToken
      }&secret=${this.config.get(
        'RECAPTCHA_SECRET',
      )}`,
    );
    const observedResponse = await lastValueFrom(
      response,
    );

    // console.log(observedResponse.data);

    if (!observedResponse.data.success) {
      throw new ForbiddenException(
        observedResponse.data['error-codes'],
      );
    }

    return true;
  }
}
