import { IsEmail, IsString } from 'class-validator';

export class AuthRefreshDto {
  @IsEmail()
  email: string;

  @IsString()
  refreshtoken: string;
}
