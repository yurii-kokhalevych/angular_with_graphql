import gql from 'graphql-tag';


export const FILTER_BLOG_QUERY = gql`
  query filterBlogs(
    $userId: ID!,
    $title: String!,
    $description: String!,
    $userName: String!,
    $createdAt: String!,
    $sortColumn: String!,
    $sortDirection: String!
    $limit: Int!
  ) {
    filterBlogs(
      userId: $userId,
      title: $title,
      description: $description,
      userName: $userName,
      createdAt: $createdAt,
      sortColumn: $sortColumn,
      sortDirection: $sortDirection,
      limit: $limit,
    ) {
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

export const LOGIN_QUERY = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      avatar
      token
      tokenExpiration
      refreshToken
    }
  }
`;

export const GOOGLE_LOGIN_QUERY = gql`
  query googleLogin($name: String!, $email: String!, $password: String!) {
    googleLogin(name: $name, email: $email, password: $password, ) {
      userId
      avatar
      token
      tokenExpiration
      refreshToken
    }
  }
`;

export const USER_BLOG_QUERY = gql`
  query user($userId: ID!) {
    user(userId: $userId) {
      blogList {
        _id
        title
        description
        creatorId
        creator {
          name
          email
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const BLOG_QUERY = gql`
  query blog($blogId: ID!) {
    blog(blogId: $blogId) {
      _id
      title
      description
      creatorId
      creator {
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const PROFILE_QUERY = gql`
  query user($userId: ID!) {
    user(userId: $userId) {
      email
      name
      avatar
    }
  }
`;


