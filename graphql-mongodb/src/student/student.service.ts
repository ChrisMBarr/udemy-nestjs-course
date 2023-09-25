import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { StudentEntity } from './student.entity';
import { CreateStudentInput } from './create-student.input';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
  ) {}

  async getStudent(id: string): Promise<StudentEntity> {
    return this.studentRepository.findOneBy({ id });
  }

  async getAllStudents(): Promise<Array<StudentEntity>> {
    return this.studentRepository.find();
  }

  async createStudent(
    createStudentInput: CreateStudentInput,
  ): Promise<StudentEntity> {
    const { firstName, lastName } = createStudentInput;

    const student = this.studentRepository.create({
      id: uuid(),
      firstName,
      lastName,
    });

    return this.studentRepository.save(student);
  }

  async getManyStudents(
    studentIds: Array<string>,
  ): Promise<Array<StudentEntity>> {
    try {
      if (typeof studentIds !== 'object' || studentIds.length < 1) {
        return [];
      }
      const students = await this.studentRepository.find({
        where: { id: { $in: [...studentIds] } as any },
      });

      return students;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }
}
