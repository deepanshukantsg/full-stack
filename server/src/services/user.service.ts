import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

const userRepo = () => AppDataSource.getRepository(User);

export const getAllUsers = async (): Promise<User[]> => {
  return userRepo().find();
};

export const getUserById = async (id: number): Promise<User | null> => {
  return userRepo().findOneBy({ id });
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  const user = userRepo().create(data);
  return userRepo().save(user);
};

export const updateUser = async (
  id: number,
  data: Partial<User>
): Promise<User | null> => {
  await userRepo().update(id, data);
  return userRepo().findOneBy({ id });
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const result = await userRepo().delete(id);
  return (result.affected ?? 0) > 0;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return userRepo()
    .createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.email = :email", { email })
    .getOne();
};
