import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController', { timestamp: true });

  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    this.logger.verbose(`User "${authCredentialsDto.username}" has signed up`);
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(`User "${authCredentialsDto.username}" has signed in`);
    return this.authService.signIn(authCredentialsDto);
  }
}
