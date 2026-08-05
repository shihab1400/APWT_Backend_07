import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface UserJwtPayload {
  sub: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user: UserJwtPayload;
}

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<RequestWithUser>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'Bearer token is required',
      );
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<UserJwtPayload>(
          token,
          {
            secret:
              this.configService.get<string>(
                'USER_JWT_SECRET',
              ),
          },
        );

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired token',
      );
    }
  }

  private extractTokenFromHeader(
    request: Request,
  ): string | undefined {
    const [type, token] =
      request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}