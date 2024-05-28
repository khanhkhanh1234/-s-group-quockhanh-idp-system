import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: sg;

  @IsNotEmpty()
  @IsString()
  password: string;
  admin: bean;
}
