import { Entity, PrimaryColumn, Column, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'Lesson' })
export class LessonEntity {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;
}
