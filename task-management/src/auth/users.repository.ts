import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  private logger = new Logger('UsersRepository', { timestamp: true });

  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (ex) {
      if (ex.code === '23505') {
        //23505 is the code for a duplicate user detected in the DB
        this.logger.error(`User "${user.username}" already exists!`, ex.stack);
        throw new ConflictException('Username already exists');
      } else {
        this.logger.error(`Unable to create user "${user.username}"`, ex.stack);
        throw new InternalServerErrorException();
      }
    }
  }
}
