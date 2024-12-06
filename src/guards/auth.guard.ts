import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import "dotenv/config";

const { JWT_SECRET_CODE } = process.env;

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(private jwtService?: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token;

    if (!token) {
      throw new UnauthorizedException("No token found");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET_CODE,
      });

      // Assigning the payload to the request object so that it's available in route handlers
      request.userInfo = payload;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
    return true;
  }

  async isValidToken(token: string): Promise<boolean> {
    if (!token) {
      throw new UnauthorizedException("No token found");
    }

    try {
      this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET_CODE,
      });
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
