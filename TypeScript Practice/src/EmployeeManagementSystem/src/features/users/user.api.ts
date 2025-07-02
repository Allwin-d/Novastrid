import axios from "@/lib/axios"; 
import type { User } from "./user.types";

export const getUsers = async (): Promise<User[]> => {
  const res = await axios.get("/user");
  return res.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await axios.get(`/user/${id}`);
  return res.data;
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const res = await axios.post("/user", user);
  return res.data;
};

export const updateUser = async (user: User): Promise<User> => {
  const res = await axios.put(`/user/${user.id}`, user);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`/user/${id}`);
};
