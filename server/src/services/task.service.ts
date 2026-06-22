import { AppDataSource } from "../config/database";
import { Tasks } from "../entities/Tasks";

const taskRepo = () => AppDataSource.getRepository(Tasks);

export const getAllTasks = async (
  developerId?: number,
  limit = 20,
  offset = 0,
): Promise<{ tasks: Tasks[]; total: number }> => {
  const [tasks, total] = await taskRepo().findAndCount({
    where: developerId ? { developerId } : undefined,
    relations: { developer: true },
    take: limit,
    skip: offset,
    order: { createdAt: "DESC" },
  });
  return { tasks, total };
};

export const assignTask = async (
  id: number,
  developerId: number | null,
): Promise<Tasks | null> => {
  await taskRepo().update(id, { developerId });
  return taskRepo().findOne({ where: { id }, relations: { developer: true } });
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

export const getTasksByStatus = async (
  status: string,
  developerId?: number,
  limit = 20,
  offset = 0,
): Promise<{ tasks: Tasks[]; total: number }> => {
  const where: Record<string, unknown> = { status: status as Tasks["status"] };
  if (developerId) where.developerId = developerId;
  const [tasks, total] = await taskRepo().findAndCount({
    where,
    relations: { developer: true },
    take: limit,
    skip: offset,
    order: { createdAt: "DESC" },
  });
  return { tasks, total };
};

export const searchTasks = async (
  query: string,
  developerId?: number,
  limit = 20,
  offset = 0,
): Promise<{ tasks: Tasks[]; total: number }> => {
  const qb = taskRepo()
    .createQueryBuilder("task")
    .leftJoinAndSelect("task.developer", "developer")
    .where(
      "LOWER(task.title) LIKE LOWER(:q) OR LOWER(task.description) LIKE LOWER(:q)",
      { q: `%${query}%` },
    );
  if (developerId)
    qb.andWhere("task.developerId = :developerId", { developerId });
  const [tasks, total] = await qb
    .take(limit)
    .skip(offset)
    .orderBy("task.createdAt", "DESC")
    .getManyAndCount();
  return { tasks, total };
};

export const getTaskStats = async (): Promise<{
  total: number;
  completed: number;
  pending: number;
}> => {
  const total = await taskRepo().count();
  const completed = await taskRepo().count({
    where: { status: "Dev Complete" as Tasks["status"] },
  });
  return { total, completed, pending: total - completed };
};
