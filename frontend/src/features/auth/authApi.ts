import { apiClient } from "../../lib/apiClient";
import type { User } from "../../types/api";

type AuthResponse = {
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  username: string;
  email: string;
  password: string;
};

export async function signup(payload: SignupPayload) {
  const response = await apiClient.post<AuthResponse>("/auth/signup", payload);
  return response.data.user;
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);
  return response.data.user;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export async function getCurrentUser() {
  const response = await apiClient.get<AuthResponse>("/auth/me");
  return response.data.user;
}
