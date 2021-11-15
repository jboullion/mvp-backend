import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthRefreshDto } from './dto/auth-refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return await this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return await this.generateTokens(email, user);
    }

    throw new UnauthorizedException('Please check login credentials');
  }

  async refreshSignIn(
    authRefreshDto: AuthRefreshDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, refreshToken } = authRefreshDto;

    const user = await this.usersRepository.findOne({ email, refreshToken });

    if (user && new Date() < new Date(user.refreshTokenExpires)) {
      return await this.generateTokens(email, user);
    }

    throw new UnauthorizedException('Please check login credentials');
  }

  async generateTokens(email: string, user: User) {
    const payload: JwtPayload = { email };
    const accessToken: string = this.jwtService.sign(payload);
    const refreshToken: string = await this.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken = Math.random().toString(36).substring(2, 18);
    const expirydate = new Date();
    expirydate.setDate(expirydate.getDate() + 6);
    await this.usersRepository.update(userId, {
      refreshToken: refreshToken,
      refreshTokenExpires: expirydate,
    });
    return refreshToken;
  }
}
