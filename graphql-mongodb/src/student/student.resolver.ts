import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { StudentType } from './student.type';
import { StudentEntity } from './student.entity';
import { CreateStudentInput } from './create-student.input';

@Resolver(() => StudentType)
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  @Query(() => StudentType)
  async student(@Args('id') id: string): Promise<StudentEntity> {
    return this.studentService.getStudent(id);
  }

  @Query(() => [StudentType])
  async allStudents(): Promise<Array<StudentEntity>> {
    return this.studentService.getAllStudents();
  }

  @Mutation(() => StudentType)
  async createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ): Promise<StudentEntity> {
    return this.studentService.createStudent(createStudentInput);
  }
}
