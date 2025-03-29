import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AdminEntity from './admin.entity';
import { Repository } from 'typeorm';
import UserEntity from '../user.entity';

export class AdminDTO {
  id: number;
  user_id: number;
}

export class AdminRegisterDTO {
  created_by: number;
  user_id: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
  ) {}
  public readonly alias = 'ad';

  // check admin first for this method
  createAdmin({ created_by, user_id }: AdminRegisterDTO) {
    if (!created_by || !user_id)
      throw new HttpException('only admin can register other admin', 401);

    return this.getRepo()
      .insert()
      .values({ created_by: created_by, user_id })
      .execute();
  }

  getAdmin({ id, user_id }: Partial<AdminDTO>) {
    if (!id && !user_id) throw new HttpException('no admin id or user id', 400);

    return this.getRepo()
      .select(['u.*'])
      .where(`${this.alias}.id = :id`, { id })
      .orWhere(`${this.alias}.user_id = :user_id`, { user_id })
      .leftJoin(UserEntity, 'u')
      .getOne();
  }

  private getRepo() {
    return this.adminRepo.createQueryBuilder(this.alias);
  }
}
