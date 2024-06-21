import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SignupDto, signinDto } from '../dtos/auth.dtos';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}
  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType === UserType.BUYER) {
      if (!body.productKey)
        throw new UnauthorizedException('Product Key is required');
    }

    const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

    const isValidPassword = await bcrypt.compare(
      validProductKey,
      body.productKey,
    );
    return this.authservice.signup(body, userType);
  }

  @Post('/signin')
  signin(@Body() body: signinDto) {
    return this.authservice.signin(body);
  }

  @Post('/key')
  generateProductkey(@Body() { email, userType }: GenerateProductKeyDto) {
    return this.authservice.generateProductKey(email, userType);
  }
}
