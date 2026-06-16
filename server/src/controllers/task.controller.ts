import { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import { asyncHandler } from "../middleware/asyncHandler";
import * as taskService from "../services/task.service";

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const developerId = req.query.developerId ? Number(req.query.developerId) : undefined;
  const tasks = await taskService.getAllTasks(developerId);
  res.status(200).json({
    message: "All tasks fetched successfully",
    data: tasks,
  });
});

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = await taskService.getTaskById(id);
  if (!task) throw new AppError(404, "Task not found");
  res.status(200).json({
    message: "task fecthed successfully",
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
