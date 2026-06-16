import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UserSkill {
  BACKEND = "Backend",
  FRONTEND = "Frontend",
  DESIGNER = "Designer",
  PM = "PM",
}

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({
    type: "enum",
    enum: UserSkill,
    nullable: true,
    default: null,
  })
  skill!: UserSkill | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
