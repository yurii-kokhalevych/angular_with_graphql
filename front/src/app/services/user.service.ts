import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {IUpdateUser, IUserBlog} from 'models';
import {PROFILE_QUERY, UPDATE_USER_MUTATION, USER_BLOG_QUERY} from 'graphqlTypes';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) { }

  getUserBlogs(userId) {
    return this.apollo
      .watchQuery<IUserBlog>({
        query: USER_BLOG_QUERY,
        variables: {
          userId
        }
      });
  }

  getProfile(userId) {
    return this.apollo
      .watchQuery<IUserBlog>({
        query: PROFILE_QUERY,
        variables: {
          userId
        }
      });
  }

  updateUser({ userId, name, email, avatar }) {
    return this.apollo
      .mutate<IUpdateUser>({
        mutation: UPDATE_USER_MUTATION,
        variables: {
          userId,
          name,
          email,
          avatar
        }
      });
  }
}
