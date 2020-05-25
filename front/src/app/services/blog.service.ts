import { Injectable } from '@angular/core';
import { ICreateBlog, IFilteredData, IGetBlog, IRemoveBlog, IUpdateBlog } from 'models';
import {ADD_BLOG_MUTATION, BLOG_QUERY, FILTER_BLOG_QUERY, REMOVE_BLOG_MUTATION, UPDATE_BLOG_MUTATION} from 'graphqlTypes';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})

export class BlogService {
  constructor(private apollo: Apollo) { }

  getBlog(blogId) {
    return this.apollo
      .watchQuery<IGetBlog>({
        query: BLOG_QUERY,
        variables: {
          blogId
        }
      });
  }

  addBlog({ userId, title, description }) {
    return this.apollo
      .mutate<ICreateBlog>({
        mutation: ADD_BLOG_MUTATION,
        variables: {
          userId,
          title,
          description
        },
      });
  }

  updateBlog({ blogId, title, description }) {
    return this.apollo
      .mutate<IUpdateBlog>({
        mutation: UPDATE_BLOG_MUTATION,
        variables: {
          blogId,
          title,
          description
        }
      });
  }

  removeBlog({ userId, blogId }) {
    return this.apollo
      .mutate<IRemoveBlog>({
        mutation: REMOVE_BLOG_MUTATION,
        variables: {
          userId,
          blogId
        }
      });
  }

  filterResponse({ title, description, userName, createdAt, userId, sortColumn, sortDirection, limit }){
    return this.apollo
      .watchQuery<IFilteredData>({
        query: FILTER_BLOG_QUERY,
        variables: {
          userId,
          title,
          description,
          userName,
          createdAt: createdAt ? new Date(`${createdAt.year}-${createdAt.month}-${createdAt.day + 1}`).toISOString() : '',
          sortColumn,
          sortDirection,
          limit,
        },
      });
  }
}
