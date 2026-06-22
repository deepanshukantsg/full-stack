import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AppError } from "../middleware/errorHandler";
import { asyncHandler } from "../middleware/asyncHandler";
import * as userService from "../services/user.service";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { password, email, firstName, lastName } = req.body;
    if (!firstName || !lastName || !email || !password) {
      throw new AppError(400, "All fields are required");
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const user = await userService.createUser({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User Registered successfully! You can now login successfully",
      data: user,
    });
  },
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req?.body;
  if (!email || !password) {
    throw new AppError(400, "All fields are required");
  }

  //   find the user with email first
  const isUserFound = await userService?.getUserByEmail(email);
  if (!isUserFound) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = bcrypt.compareSync(password, isUserFound.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  //   create JWt token here
  const token = jwt.sign(
    { id: isUserFound.id, email: isUserFound.email, skill: isUserFound.skill },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as "7d" },
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      message: "Login successful",
      data: {
        id: isUserFound.id,
        email: isUserFound.email,
        firstName: isUserFound.firstName,
        lastName: isUserFound.lastName,
        skill: isUserFound.skill,
        token,
      },
    });
});
