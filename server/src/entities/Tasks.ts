import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

export enum TaskStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  CODE_REVIEW = "Code Review",
  PR_REVIEW = "PR Review",
  DEV_COMPLETE = "Dev Complete",
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  HIGHEST = "HIGHEST",
}

@Entity("tasks")
export class Tasks extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({
    type: "enum",
    enum: TaskStatus,
    nullable: false,
    default: TaskStatus.TODO,
  })
  status!: TaskStatus;

  @Column({
    type: "enum",
    enum: TaskPriority,
    nullable: false,
    default: TaskPriority.LOW,
  })
  priority!: TaskPriority;

  @Column({ type: "date", nullable: true })
  dueDate!: Date | null;

  @Column({ nullable: true })
  developerId!: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL", eager: false })
  @JoinColumn({ name: "developerId" })
  developer?: User;

  @CreateDateColumn()
  createdAt!: Date;
}
