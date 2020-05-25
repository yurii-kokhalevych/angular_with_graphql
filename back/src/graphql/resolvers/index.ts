import { UserMutation, UserQueries, UserBlogs } from './user';
import { BlogQueries, BlogMutation, CreatorBlogs } from './blog'

const rootResolver = {
    Query: {
        ...UserQueries,
        ...BlogQueries,
    },
    Mutation: {
        ...UserMutation,
        ...BlogMutation,
    },
    User: {
        ...UserBlogs,
    },
    Blog: {
        ...CreatorBlogs,
    }
};

export default rootResolver;
