import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getGoogleAuthUrl(): string {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const callbackUrl =
      this.configService.get<string>('GOOGLE_CALLBACK_URL') ||
      'http://localhost:3001/api/auth/google/callback';

    if (!clientId) {
      this.logger.error('GOOGLE_CLIENT_ID is not configured in .env');
      throw new BadRequestException('Google Client ID is not configured');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async handleGoogleCallback(code: string): Promise<string> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackUrl =
      this.configService.get<string>('GOOGLE_CALLBACK_URL') ||
      'http://localhost:3001/api/auth/google/callback';

    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      (isProd ? 'https://ticket-motogp-hape.vercel.app' : 'http://localhost:5173');

    try {
      // 1. Exchange code for Google Access Token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId || '',
          client_secret: clientSecret || '',
          redirect_uri: callbackUrl,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        this.logger.error(`Google token exchange failed: ${errorData}`);
        return `${frontendUrl}/?auth_error=token_exchange_failed`;
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // 2. Fetch user profile from Google UserInfo endpoint
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!profileResponse.ok) {
        this.logger.error('Failed to fetch Google user profile');
        return `${frontendUrl}/?auth_error=profile_fetch_failed`;
      }

      const profile = await profileResponse.json();
      const email = profile.email;
      const name = profile.name || email.split('@')[0];
      const picture = profile.picture || '';

      // 3. Find or Create User in Neon PostgreSQL Database
      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        const dummyPassword = await bcrypt.hash(randomUUID(), 10);
        user = await this.prisma.user.create({
          data: {
            email,
            name,
            password: dummyPassword,
            role: 'CUSTOMER',
          },
        });
        this.logger.log(`Created new Google user in database: ${email}`);
      }

      // 4. Generate JWT Token
      const jwtToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      // 5. Build Redirect URL to Frontend with user details and token
      const redirectParams = new URLSearchParams({
        auth: 'success',
        token: jwtToken,
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: picture,
        role: user.role,
      });

      return `${frontendUrl}/?${redirectParams.toString()}`;
    } catch (error) {
      this.logger.error('Unexpected error in Google Callback', error);
      return `${frontendUrl}/?auth_error=internal_error`;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau kata sandi tidak sesuai');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau kata sandi tidak sesuai');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existing) {
      throw new ConflictException('Email ini sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        phone: registerDto.phone,
        role: 'CUSTOMER',
      },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Pengguna tidak ditemukan');
    }

    return user;
  }
}
