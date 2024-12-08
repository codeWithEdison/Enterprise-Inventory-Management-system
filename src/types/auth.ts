// src/types/auth.ts
import { UserResponse } from './api/types';

export interface TokenInfo {
  token: string;
  expires: string;
}

export interface Tokens {
  access: TokenInfo;
  refresh: TokenInfo;
}

export interface LoginResponse {
  user: UserResponse;
  tokens: Tokens;
}

export interface LoginInput {
  email: string;
  password: string;
}