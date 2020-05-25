import { gql } from 'apollo-server-express';
import { ApolloServerExpressConfig  } from 'apollo-server-express';
import resolvers from '../resolvers/index';

const typeDefs = gql`
    type Query {
        users: [User!]!
        user(userId: ID!): User!
        login(email: String!, password: String!): AuthData!
        googleLogin(name: String!, email: String!, password: String!): AuthData!
        blogs: [Blog!]!
        blog(blogId: ID!): Blog!
        filterBlogs(
            userId: ID!, 
            title: String!, 
            description: String!, 
            userName: String!, 
            createdAt: String!,
            sortColumn: String!,
            sortDirection: String!,
            limit: Int!
        ): [Blog!]
    }
    type Mutation {
        createUser(name: String!, email: String!, password: String!): AuthData!
        updateUser(userId: ID!, update: UpdateUser): User!
        createBlog(userId: ID!, title: String! description: String!): Blog!
        updateBlog(blogId: ID!, title: String! description: String!): Blog!
        deleteBlog(userId: ID!, blogId: ID!): DeleteBlog!
    }
    type Subscription {
        userAdded: User
        blogAdded: Blog
    }
    type User {
        _id: ID!
        email: String!
        name: String!
        password: String
        avatar: String!
        blogList: [Blog]
        createdAt: String!
        updatedAt: String!
    }
    type Blog {
        _id: ID!
        title: String!
        description: String!
        creatorId: ID!
        name: String!
        creator: User
        createdAt: String!
        updatedAt: String!
    }
    type AuthData {
        userId: ID!
        avatar: String!
        token: String!
        refreshToken: String!
        tokenExpiration: Int!
    }
    type DeleteBlog {
        blogId: ID!
    }
    input UpdateUser {
        name: String
        email: String
        avatar: String
    }
`;

const schema: ApolloServerExpressConfig = {
    typeDefs,
    resolvers,
    introspection: false,
    context: async ({ req, connection }) => {
        if (connection) {
            return connection.context;
        }
        return { isAuth: !req.headers.Authorization };
    },
    playground: false
};

export default schema;
