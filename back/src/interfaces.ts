import { Document } from 'mongoose';

export interface IBlogBody {
    title: string;
    description: string;
}
 export interface IBlogId {
    blogId: string;
}

 export interface IUserId {
    userId: string;
}

export interface IBogGeneral extends IBlogBody{
    _id: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IFilteredBlog extends IBlogBody {
    userName: string;
    createdAt: string;
    userId: string;
    sortColumn: string;
    sortDirection: string;
    limit: number;
}

export interface IAuth {
    isAuth : boolean
}

export interface ILogin {
     email: string;
     password: string;
 }

export interface IUserInput extends ILogin {
     name: string;
 }


export interface IUpdateUser extends IUserId {
     update: {
         name: string;
         email: string;
         avatar: string;
     }
 }

export interface IModel extends Document {
     _doc: {
         [key: string]: any;
     },
 }

export type IBlog = IBlogBody & IUserId;
export type IBlogUpdate = IBlogBody & IBlogId;
export type IBlogDelete= IBlogId & IUserId;
export type Context<T = object> = T;
