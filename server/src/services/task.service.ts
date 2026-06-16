import { AppDataSource } from "../config/database";
import { Tasks } from "../entities/Tasks";

const taskRepo = () => AppDataSource.getRepository(Tasks);

export const getAllTasks = async (developerId?: number): Promise<Tasks[]> => {
  return taskRepo().find({
    where: developerId ? { developerId } : undefined,
    relations: { developer: true },
  });
};

export const getTaskById = async (id: number): Promise<Tasks | null> => {
  return taskRepo().findOne({ where: { id }, relations: { developer: true } });
};

export const createTask = async (data: Partial<Tasks>): Promise<Tasks> => {
  const task = taskRepo().create(data);
  return taskRepo().save(task);
};

export const updateTask = async (
  id: number,
  data: Partial<Tasks>,
): Promise<Tasks | null> => {
  await taskRepo().update(id, data);
  return taskRepo().findOne({ where: { id }, relations: { developer: true } });
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const result = await taskRepo().delete(id);
  return (result.affected ?? 0) > 0;
};
