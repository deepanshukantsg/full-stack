import { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import { asyncHandler } from "../middleware/asyncHandler";
import * as taskService from "../services/task.service";

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const developerId = req.query.developerId
    ? Number(req.query.developerId)
    : undefined;
  const limit = req.query.limit ? Math.min(Number(req.query.limit), 100) : 20;
  const offset = req.query.offset ? Number(req.query.offset) : 0;
  const { tasks, total } = await taskService.getAllTasks(
    developerId,
    limit,
    offset,
  );
  res.status(200).json({
    message: "All tasks fetched successfully",
    data: tasks,
    pagination: { total, limit, offset },
  });
});

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = await taskService.getTaskById(id);
  if (!task) throw new AppError(404, "Task not found");
  res.status(200).json({
    message: "Task fetched successfully",
    data: task,
  });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new AppError(400, "title and description are required");
  }
  const task = await taskService.createTask(req.body);
  res.status(201).json({ message: "Task created successfully", data: task });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = await taskService.updateTask(id, req.body);
  if (!task) throw new AppError(404, "Task not found");
  res.status(201).json({ message: "Task updated successfully", data: task });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted = await taskService.deleteTask(id);
  if (!deleted) throw new AppError(404, "Task not found");
  res.status(204).send();
});

export const getTasksByStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const status = String(req.params.status);
    const tasks = await taskService.getTasksByStatus(status);
    res
      .status(200)
      .json({ message: "Tasks fetched successfully", data: tasks });
  },
);

export const searchTasks = asyncHandler(async (req: Request, res: Response) => {
  const raw = req.query.query;
  const query = (
    typeof raw === "string"
      ? raw
      : Array.isArray(raw)
        ? String(raw[0] ?? "")
        : ""
  ).trim();
  if (!query) throw new AppError(400, "query param is required");
  const tasks = await taskService.searchTasks(query);
  res.status(200).json({ message: "Tasks fetched successfully", data: tasks });
});

export const getTaskStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await taskService.getTaskStats();
    res
      .status(200)
      .json({ message: "Stats fetched successfully", data: stats });
  },
);

export const assignTask = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { developerId } = req.body;
  const task = await taskService.assignTask(id, developerId ?? null);
  if (!task) throw new AppError(404, "Task not found");
  res.status(200).json({ message: "Task assigned successfully", data: task });
});
