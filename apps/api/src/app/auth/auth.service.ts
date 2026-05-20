import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LogsService } from '../logs/logs.service';
import { LogLevel, LogCategory } from '@fizzup/shared';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logsService: LogsService,
  ) {}

  async login(email: string, password: string, ip?: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await this.logsService.createLog({
        level: LogLevel.WARN,
        category: LogCategory.SECURITY,
        message: 'Tentative de connexion échouée',
        actor: email,
        ip,
        details: 'Identifiants invalides.',
      });
      throw new UnauthorizedException('Identifiants invalides');
    }
    await this.logsService.createLog({
      level: LogLevel.INFO,
      category: LogCategory.AUTH,
      message: 'Connexion réussie',
      actor: email,
      ip,
    });
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async register(email: string, password: string, ip?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Cet e-mail est déjà utilisé');
    }
    const user = await this.usersService.create(email, password);
    await this.logsService.createLog({
      level: LogLevel.SUCCESS,
      category: LogCategory.AUTH,
      message: 'Inscription réussie',
      actor: email,
      ip,
    });
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async logout(email: string, ip?: string) {
    await this.logsService.createLog({
      level: LogLevel.INFO,
      category: LogCategory.AUTH,
      message: 'Déconnexion',
      actor: email,
      ip,
    });
  }
}
