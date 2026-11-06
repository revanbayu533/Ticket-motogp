import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Initiate Google OAuth 2.0 Login redirect' })
  @ApiResponse({ status: 302, description: 'Redirects browser to Google Accounts sign-in' })
  @Get('google')
  googleLogin(@Res() res: Response) {
    const authUrl = this.authService.getGoogleAuthUrl();
    return res.redirect(authUrl);
  }

  @ApiOperation({ summary: 'Google OAuth 2.0 Callback handler' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with token & user details' })
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    if (error || !code) {
      const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
      const frontendUrl = isProd
        ? 'https://ticket-motogp-hape.vercel.app'
        : 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent(error || 'no_code')}`);
    }

    const redirectUrl = await this.authService.handleGoogleCallback(code);
    return res.redirect(redirectUrl);
  }

  @ApiOperation({ summary: 'Email & Password Login' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'User Registration' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
