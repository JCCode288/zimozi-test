import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDTO, RegisterDTO } from './interfaces/auth.interface';
import { Auth } from 'firebase-admin/lib/auth/auth';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService implements OnModuleInit {
  private firebase: Auth;
  constructor(private readonly userService: UserService) {}

  onModuleInit() {
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FBS_PROJECT_ID,
        privateKey: process.env.FBS_PRIVATE_KEY,
        clientEmail: process.env.FBS_CLIENT_EMAIL,
      }),
    });
    this.firebase = app.auth();
  }

  async register(registerCred: RegisterDTO) {
    const userRegistered = await this.userService.getUserByUid(
      registerCred.uid,
    );

    if (userRegistered) return userRegistered;

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
