import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksModule } from './tasks/tasks.module';
import { TaskEntity } from './tasks/task.entity';

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
      entities: [TaskEntity],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
