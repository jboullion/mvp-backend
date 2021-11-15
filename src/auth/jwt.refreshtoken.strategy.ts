/**
 * ! NOTE: NOT CURRENTLY IN USE
 */
// https://www.learmoreseekmore.com/2020/10/part-2-nestjs-jwt-authentication-refreshtoken.html
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException, Body } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refreshtoken',
) {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('accessToken'),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: JwtPayload): Promise<User> {
    const user = await this.usersRepository.findOne({ email: payload.email });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (req.body.refreshToken != (await user).refreshToken) {
      throw new UnauthorizedException();
    }
    if (new Date() > new Date((await user).refreshTokenExpires)) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
