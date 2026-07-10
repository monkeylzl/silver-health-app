import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { isInternalAppKeyValid } from './internal-key';

export class InternalAppKeyGuard implements CanActivate {
  constructor(private readonly expectedKey: string) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      method?: string;
      path?: string;
      headers?: Record<string, string | string[] | undefined>;
    }>();

    if (request.method === 'GET' && request.path === '/api/health') return true;

    const headerValue = request.headers?.['x-silver-app-key'];
    const providedKey = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (!isInternalAppKeyValid(providedKey, this.expectedKey)) {
      throw new UnauthorizedException('app access denied');
    }
    return true;
  }
}
