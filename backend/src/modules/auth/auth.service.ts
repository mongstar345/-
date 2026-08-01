import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role } from './entities/role.entity';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { LoggerService } from '../../common/services/logger.service';

interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
}

interface AuthResponse {
  user: Partial<User>;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  // ==========================================
  // REGISTER NEW USER
  // ==========================================
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { username, email, password, fullName } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException(
        existingUser.username === username
          ? 'Username already taken'
          : 'Email already registered',
      );
    }

    // Hash password
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Get default 'user' role
    const userRole = await this.roleRepository.findOne({ where: { name: 'user' } });
    if (!userRole) {
      throw new Error('Default user role not found in database');
    }

    // Create user
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      roles: [userRole],
    });

    const savedUser = await this.userRepository.save(user);

    this.logger.log(`New user registered: ${username} (${email})`);

    // Generate tokens
    const tokens = await this.generateTokens(savedUser);

    // Save refresh token
    await this.updateRefreshToken(savedUser.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(savedUser),
      ...tokens,
    };
  }

  // ==========================================
  // LOGIN
  // ==========================================
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { identifier, password } = loginDto;

    // Find user by email or username
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is banned
    if (user.isBanned) {
      if (user.bannedUntil && user.bannedUntil > new Date()) {
        throw new UnauthorizedException(
          `Account banned until ${user.bannedUntil.toISOString()}. Reason: ${user.banReason || 'Violation of terms'}`,
        );
      } else if (!user.bannedUntil) {
        throw new UnauthorizedException(
          `Account permanently banned. Reason: ${user.banReason || 'Violation of terms'}`,
        );
      }
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    user.loginCount += 1;
    await this.userRepository.save(user);

    this.logger.log(`User logged in: ${user.username}`);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // ==========================================
  // REFRESH TOKEN
  // ==========================================
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['roles'],
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================
  async logout(userId: string): Promise<{ message: string }> {
    await this.userRepository.update(userId, { refreshToken: null });
    this.logger.log(`User logged out: ${userId}`);
    return { message: 'Logged out successfully' };
  }

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.configService.get<string>('JWT_PASSWORD_RESET_SECRET'),
        expiresIn: this.configService.get<string>('JWT_PASSWORD_RESET_EXPIRATION'),
      },
    );

    // Save token and expiration
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.userRepository.save(user);

    // TODO: Send email with reset link
    this.logger.log(`Password reset requested for: ${email}`);
    this.logger.debug(`Reset token: ${resetToken}`); // Remove in production

    return { message: 'If the email exists, a reset link has been sent' };
  }

  // ==========================================
  // RESET PASSWORD
  // ==========================================
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_PASSWORD_RESET_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub, passwordResetToken: token },
      });

      if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      if (user.passwordResetExpires < new Date()) {
        throw new BadRequestException('Reset token has expired');
      }

      // Hash new password
      const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update password and clear reset fields
      user.password = hashedPassword;
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await this.userRepository.save(user);

      this.logger.log(`Password reset successful for user: ${user.username}`);

      return { message: 'Password reset successful' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  // ==========================================
  // VERIFY EMAIL
  // ==========================================
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_EMAIL_VERIFICATION_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub, emailVerificationToken: token },
      });

      if (!user) {
        throw new BadRequestException('Invalid verification token');
      }

      user.emailVerified = true;
      user.emailVerificationToken = null;
      await this.userRepository.save(user);

      this.logger.log(`Email verified for user: ${user.username}`);

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles?.map((role) => role.name) || [],
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  private sanitizeUser(user: User): Partial<User> {
    const { password, refreshToken, emailVerificationToken, passwordResetToken, ...sanitized } = user;
    return sanitized;
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}
