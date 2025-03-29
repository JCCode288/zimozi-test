import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CustomerEntity from './customer.entity';
import { Repository } from 'typeorm';
import UserEntity from '../user.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly custRepo: Repository<CustomerEntity>,
  ) {}

  public readonly alias = 'cu';

  getCustomerByEmail(email: string) {
    return this.getRepo()
      .select()
      .leftJoin(UserEntity, 'u')
      .where('u.email = :email', { email })
      .getOneOrFail();
  }

  getAllCustomer({ page = 1, limit = 10, name, email }) {
    const builder = this.getRepo().leftJoin(UserEntity, 'u');

    if (name) {
      builder.orWhere("u.name ILIKE '%:name%'", { name });
    }

    if (email) {
      builder.orWhere('u.email = :email', { email });
    }

    builder.limit(limit);
    builder.offset(page - 1 * limit);

    console.log(builder.getQuery());

    return builder.getManyAndCount();
  }

  createCustomer(user_id) {
    return this.getRepo().insert().values({ user_id }).execute();
  }

  private getRepo() {
    return this.custRepo.createQueryBuilder(this.alias);
  }
}
