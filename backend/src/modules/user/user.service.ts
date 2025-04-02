import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import UserEntity from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { RegisterDTO } from '../auth/interfaces/auth.interface';
import { AdminService } from './admin/admin.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly adminService: AdminService,
  ) {}

  public readonly alias = 'user';

  async getUserByUid(uid: string) {
    const user = await this.getRepo()
      .leftJoinAndSelect(`${this.alias}.admin`, this.adminService.alias)
      .where('uid = :uid', { uid })
      .getOne();

    return user;
  }

  async createUser(user: RegisterDTO) {
    const userInserted = await this.getRepo()
      .insert()
      .values(user)
      .returning(['id', 'name', 'uid'])
      .execute();

    if (!userInserted.generatedMaps.length)
      throw new HttpException('failed to insert user', 500);

    const generatedUser = userInserted.generatedMaps[0];

    return generatedUser;
  }

  async elevateToAdmin(userId: number, createdBy: UserEntity) {
    if (!userId) throw new HttpException('invalid user', 400);
    if (userId === createdBy.id)
      throw new HttpException('cannot elevate self', 401);

    const user = await this.getRepo()
      .where('id = :id', { id: userId })
      .getOne();

    if (!user) throw new HttpException('user not found', 404);

    await this.dataSource.transaction(async (em) => {
      const admin = await this.adminService.getAdmin({ user_id: user.id });
      if (admin) throw new HttpException('user already admin', 400);

      const createAdm = await this.adminService.createAdmin({
        user_id: userId,
        created_by: createdBy.id,
      });
    });

    return true;
  }

  private getRepo() {
    return this.userRepo.createQueryBuilder(this.alias);
  }
}
