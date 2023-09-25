import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { LessonType } from './lesson.type';
import { LessonService } from './lesson.service';
import { CreateLessonInput } from './create-lesson.input';
import { LessonEntity } from './lesson.entity';

@Resolver(() => LessonType)
export class LessonResolver {
  constructor(private lessonService: LessonService) {}

  @Query(() => LessonType)
  async lesson(@Args('id') id: string): Promise<LessonEntity> {
    return this.lessonService.getLesson(id);
  }

  @Query(() => [LessonType])
  async allLessons(): Promise<Array<LessonEntity>> {
    return this.lessonService.getAllLessons();
  }

  @Mutation(() => LessonType)
  async createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ): Promise<LessonEntity> {
    return this.lessonService.createLesson(createLessonInput);
  }
}
