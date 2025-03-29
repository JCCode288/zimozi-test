import { Injectable } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './interfaces/auth.interfaces';
import { AdminService } from '../user/admin/admin.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}

  async login(loginCred: LoginDTO) {
    const user = await this.userService.getUserByEmail(loginCred.email);
    const admin = await this.adminService.getAdmin({ user_id: user.id });

    if (admin) return admin;

    return user; // change to create token
  }

  register(registerCred: RegisterDTO) {
    return this.userService.createUser(registerCred);
  }
}
