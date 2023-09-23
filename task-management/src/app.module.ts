import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksModule } from './tasks/tasks.module';
import { TaskEntity } from './tasks/task.entity';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './auth/user.entity';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'task-management',
      username: 'postgres',
      password: 'postgres',
      entities: [TaskEntity, UserEntity],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
