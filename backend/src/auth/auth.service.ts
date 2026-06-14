import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(data: any) {
    const existingUser = await this.usersService.findOneByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await this.usersService.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || UserRole.STUDENT,
    });

    return this.login(user);
  }

  async login(user: any) {
    if (user.password) {
      const dbUser = await this.usersService.findOneByEmail(user.email);
      if (!dbUser) throw new UnauthorizedException('Invalid credentials');
      
      const isMatch = await bcrypt.compare(user.password, dbUser.passwordHash);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
      
      user = dbUser;
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}
