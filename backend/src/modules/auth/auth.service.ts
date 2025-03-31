import {
  Global,
  HttpException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDTO, RegisterDTO } from './interfaces/auth.interface';
import { Auth } from 'firebase-admin/lib/auth/auth';
import * as admin from 'firebase-admin';

@Global()
@Injectable()
export class AuthService implements OnModuleInit {
  private firebase: Auth;
  constructor(private readonly userService: UserService) {}

  onModuleInit() {
    const cred = require('../../../' + process.env.FIREBASE_CRED_PATH);
    const app = admin.initializeApp({
      credential: admin.credential.cert(cred),
    });
    this.firebase = app.auth();
  }

  async register(registerCred: RegisterDTO) {
    const userRegistered = await this.userService.getUserByEmail(
      registerCred.email,
    );

    if (userRegistered) throw new HttpException('you already registered', 400);

    const user = await this.userService.createUser(registerCred);

    return user;
  }

  async findUser(uid: string) {
    return this.userService.getUserByUid(uid);
  }

  async validateToken(token: string) {
    const cred = await this.firebase.verifyIdToken(token, true);
    const user = await this.firebase.getUser(cred.uid);

    return user;
  }
}
