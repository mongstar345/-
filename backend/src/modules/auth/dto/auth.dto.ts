import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Username (3-50 characters)',
    example: 'mustafa_ahmed',
  })
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(50, { message: 'Username cannot exceed 50 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'mustafa@nahrain.edu.iq',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'Password (min 8 characters, must include uppercase, lowercase, number, and special character)',
    example: 'Password@123',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;

  @ApiProperty({
    description: 'Full name',
    example: 'Mustafa Ahmed',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Email or username',
    example: 'mustafa@nahrain.edu.iq',
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'Password',
    example: 'Password@123',
  })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
  })
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address',
    example: 'mustafa@nahrain.edu.iq',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewPassword@123',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email verification token',
  })
  @IsString()
  token: string;
}
