import mongoose from 'mongoose';
import { Blog, User } from '../../models';
import { addTimeStamp } from './merge';
import { authValidation } from "../../middleware/validation";
import { Context, IAuth, IBlogId, IBlog, IBlogDelete, IBlogUpdate, IBogGeneral, IFilteredBlog, IModel } from '../../interfaces';

/**
 * Blog Queries
 */

const BlogQueries = {
    blogs: async (parent: any, args: any, context: Context<IAuth>) => {
        authValidation(context);
        try {
            const blogs = await Blog.find();
            return blogs.map((blog: any) => {
                return addTimeStamp(blog);
            });
        } catch (err) {
            throw err;
        }
    },
    blog: async (parent: any, { blogId }: IBlogId, context: Context<IAuth>) => {
        authValidation(context);
        try {
            const blog = await Blog.findById(blogId) as IModel;
            return addTimeStamp(blog);
        } catch (err) {
            throw err;
        }
    },
    filterBlogs: async (parent: any, { userId, title, description, userName, createdAt, sortColumn, sortDirection, limit }: IFilteredBlog, context: Context<IAuth>) => {
        authValidation(context);
        const fieldName = sortColumn === 'creator' ? 'name': sortColumn
        const sortableValue = sortDirection === '' ? {} : { [fieldName]: sortDirection === 'asc' ? 1 : -1 }
        try {
            const user = await User.find({ name: {'$regex': userName, '$options': 'i'}});
            const mapUser = user ? user.map(el => el._id) : []
            const blog = await Blog.find({
                title: {'$regex': title, '$options': 'i'},
                description: {'$regex': description, '$options': 'i'},
                createdAt: { $lte: createdAt ? createdAt : new Date() },
                creatorId: { $in: userId ? [userId] : mapUser }
               }).sort(sortableValue).skip(limit - 10).limit(limit);
            return blog;
        } catch (err) {
            throw err;
        }
    },
};

/**
 * Blog Mutations
 */
const BlogMutation = {
    createBlog: async (parent: any, { userId, title, description, }: IBlog, context: Context<IAuth>) => {
        authValidation(context);
        try {
            const user = await User.findOne({ _id: userId }) as any;
            const newBlog = new Blog({
                _id: new mongoose.Types.ObjectId(),
                title,
                description,
                creatorId: userId,
                name: user.name
            });
            const savedBlog = await newBlog.save() as IModel;
            return addTimeStamp(savedBlog);
        } catch (error) {
            throw error;
        }
    },
    updateBlog: async (parent: any, { blogId, title, description }: IBlogUpdate, context: Context<IAuth>) => {
        authValidation(context);
        try {
            const blog = await Blog.findByIdAndUpdate(blogId, { title, description }, {  new: true }) as IModel;
            return addTimeStamp(blog);
        } catch (error) {
            throw error;
        }
    },
    deleteBlog: async (parent: any, { userId, blogId }: IBlogDelete, context: Context<IAuth>) => {
        authValidation(context);
        try {
            const blogToDelete = await Blog.findOne({ _id: blogId }) as (IBogGeneral | null);
            if((blogToDelete && blogToDelete.creatorId) === userId) {
                await Blog.deleteOne({ _id: blogId });
                return ({ blogId });
            } else {
                throw new Error('You are not allow delete this post');
            }
        } catch (error) {
            throw error;
        }
    }
};

/**
 * Blogs creator
 */

const CreatorBlogs = {
    creator: async ({ creatorId }: { creatorId: string }) => {
        authValidation({ isAuth: !!creatorId });
        try {
            const user = await User.findOne({ _id: creatorId }) as IModel;
            return addTimeStamp(user);
        } catch (error) {
            throw error;
        }
    },
}

export { BlogQueries, BlogMutation, CreatorBlogs };
