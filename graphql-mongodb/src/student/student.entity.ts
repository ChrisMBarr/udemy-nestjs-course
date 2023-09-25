import { Entity, PrimaryColumn, Column, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'Student' })
export class StudentEntity {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
