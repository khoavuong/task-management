import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthCredentials {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: String;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'At least 1 lower, 1 upper, 1 number or speacial character',
  })
  password: String;
}
