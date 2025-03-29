import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './user.entity';
import { Repository } from 'typeorm';
import { RegisterDTO } from '../auth/interfaces/auth.interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  public readonly alias = 'u';

  getUserByEmail(email: string) {
    return this.getRepo()
      .where(`${this.alias}.email = :email`, { email })
      .getOneOrFail();
  }

  createUser(user: RegisterDTO) {
    return this.getRepo()
      .insert()
      .values([user])
      .returning([`${this.alias}.email`, `${this.alias}.name`])
      .execute();
  }

  private getRepo() {
    return this.userRepo.createQueryBuilder(this.alias);
  }
}
