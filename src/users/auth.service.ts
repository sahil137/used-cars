import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    /// See is email is in use

    const users = await this.userService.find(email);

    if (users.length) throw new BadRequestException('Email already in use');

    /// Hash the password
    // const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(password, 13);

    /// Create a new User and save it
    const user = await this.userService.create(email, hashedPassword);

    return user;
    /// return the user
  }

  async login(email: string, password: string) {
    const [user] = await this.userService.find(email);

    if (!user) throw new NotFoundException('User Not Found');

    const hashedPassword = user.password;

    const isMatched = await bcrypt.compare(password, hashedPassword);

    if (!isMatched) throw new BadRequestException('Passwords dont Match');

    return user.id;
  }
}
