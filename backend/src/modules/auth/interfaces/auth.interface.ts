import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class LoginDTO {
  @IsEmail(undefined, { message: 'invalid email' })
  @IsNotEmpty()
  public email: string;

  @IsUUID(undefined, { message: 'invalid uid' })
  @IsNotEmpty()
  public uid: string;
}

export class RegisterDTO {
  @IsUUID(undefined, { message: 'invalid uid' })
  @IsNotEmpty()
  public uid: string;

  @IsEmail(undefined, { message: 'invalid email' })
  @IsNotEmpty()
  public email: string;

  @IsString({ message: 'invalid name' })
  @IsNotEmpty()
  public name: string;
}
