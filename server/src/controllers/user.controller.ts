import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import * as userService from "../services/user.service";
import { AppError } from "../middleware/errorHandler";
import { asyncHandler } from "../middleware/asyncHandler";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await userService.getUserById(id);
  if (!user) throw new AppError(404, "User not found");
  res.json(user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { password, email, firstName, lastName } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new AppError(400, "All fields are required");
  }

  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const user = await userService.createUser({
    ...req.body,
    password: hashedPassword,
  });
  res.status(201).json({ message: "User created successfully!", data: user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const { password } = req?.body;

  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const user = await userService.updateUser(id, {
    ...req?.body,
    password: hashedPassword,
  });
  if (!user) throw new AppError(404, "User not found");
  res.status(201).json({
    message: "User updated successfully",
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted = await userService.deleteUser(id);
  if (!deleted) throw new AppError(404, "User not found");
  res.status(204).send();
});
