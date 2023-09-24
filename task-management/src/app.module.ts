import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksModule } from './tasks/tasks.module';
import { TaskEntity } from './tasks/task.entity';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './auth/user.entity';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`environments/.env.${process.env.ENVIRONMENT}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        entities: [TaskEntity, UserEntity],
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_DATABASE'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
      }),
    }),
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
