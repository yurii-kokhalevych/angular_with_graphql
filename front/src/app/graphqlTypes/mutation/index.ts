import gql from 'graphql-tag';

export const REGISTRATION_MUTATION = gql`
  mutation createUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      userId
      avatar
      token
      tokenExpiration
    }
  }
`;

export const ADD_BLOG_MUTATION =  gql`
  mutation createBlog($userId: ID!, $title: String! $description: String!) {
    createBlog(userId: $userId, title: $title, description: $description) {
      _id
      title
      description
      creatorId
      creator {
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BLOG_MUTATION = gql`
  mutation updateBlog($blogId: ID!, $title: String! $description: String!) {
    updateBlog(blogId: $blogId, title: $title, description: $description) {
      _id
      title
      description
      creatorId
      creator {
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($userId: ID!, $name: String, $email: String, $avatar: String) {
    updateUser(userId: $userId, update: { name: $name, email: $email, avatar: $avatar }) {
      _id
      email
      name
      avatar
    }
  }
`;

export const REMOVE_BLOG_MUTATION =  gql`
  mutation deleteBlog($userId: ID!, $blogId: ID!) {
    deleteBlog(userId: $userId, blogId: $blogId) {
      blogId
    }
  }
`;




