import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentEntity } from './student.entity';
import { StudentService } from './student.service';
import { StudentResolver } from './student.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity])],
  providers: [StudentResolver, StudentService],
})
export class StudentModule {}
