import { IBlog } from './blog';

interface IAuth {
  userId: string;
  token: string;
  avatar: string;
  refreshToken: string;
  tokenExpiration: number;
}

export interface IRegister {
  createUser: IAuth;
}

export interface ILogin {
  login: IAuth;
}

export interface IGoogleLogin {
  googleLogin: IAuth;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  password: string;
  avatar: string;
  blogList: IBlog[];
  createdAt: string;
  updatedAt: string;
}

export interface IUserBlog {
  user: IUser;
}

export interface IUpdateUser {
  updateUser: IUser;
}
