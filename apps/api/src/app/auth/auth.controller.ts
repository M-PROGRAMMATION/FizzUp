import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Ip,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: { email: string; password: string }, @Ip() ip: string) {
    return this.authService.login(body.email, body.password, ip);
  }

  @Post('register')
  register(@Body() body: { email: string; password: string }, @Ip() ip: string) {
    return this.authService.register(body.email, body.password, ip);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async logout(
    @Request() req: Express.Request & { user: { id: string; email: string; role: string } },
    @Ip() ip: string,
  ) {
    await this.authService.logout(req.user.email, ip);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req: Express.Request & { user: { id: string; email: string; role: string } }) {
    return req.user;
  }
}
