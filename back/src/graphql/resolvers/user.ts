import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {Blog, User} from '../../models';
import { addTimeStamp } from './merge';
import { setTokens } from '../../middleware/setToken';
import { authValidation } from '../../middleware/validation';
import { Context, IAuth, IUserId, IUpdateUser, IUserInput, ILogin, IModel } from '../../interfaces'

/**
 * User Queries
 */



const UserQueries = {
    users: async (parent: any, args: any, context: Context<IAuth>) => {
        authValidation(context);
        try {
            const users = await User.find();
            return users.map((user: any) => {
                return addTimeStamp(user);
            });
        } catch (err) {
            throw err;
        }
    },
    user: async (parent: any, { userId }: IUserId, context: Context<IAuth>) => {
        authValidation(context);
        try {
            const user = await User.findById(userId) as IModel;
            return addTimeStamp(user);
        } catch (err) {
            throw err;
        }
    },
    login: async (parent: any, { email, password }: ILogin) => {
        try {
            const user: any = await User.findOne({ email });
            if (!user) {
                throw new Error('User does not Exists. Please create account');
            }
            const passwordIsValid = await bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) throw new Error('Password incorrect');
            const { token, refreshToken } = setTokens(user.id);
            return {
                userId: user.id,
                avatar: user.avatar,
                token,
                refreshToken,
                tokenExpiration: 1
            };
        } catch (err) {
            throw err;
        }
    },
    googleLogin: async (parent: any, { name, email, password }: IUserInput) => {
        try {
            const user: any = await User.findOne({ email });
            if (!user) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email,
                    name,
                    avatar: '',
                    password: hashedPassword,
                    blogList: [],
                });
                const savedUser = await newUser.save() as IModel & { avatar: string };
                const { token, refreshToken } = setTokens(savedUser.id);
                return {
                    userId: savedUser.id,
                    avatar: savedUser.avatar,
                    token,
                    refreshToken,
                    tokenExpiration: 1
                };
            }
            const passwordIsValid = await bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) throw new Error('Password incorrect');
            const { token, refreshToken } = setTokens(user.id);
            return {
                userId: user.id,
                avatar: user.avatar,
                token,
                refreshToken,
                tokenExpiration: 1
            };
        } catch (err) {
            throw err;
        }
    },
};

/**
 * User Mutations
 */
const UserMutation = {
    createUser: async (parent: any, { email, password, name }: IUserInput ) => {
        try {
            const user = await User.findOne({
                email
            });
            if (user) {
                throw new Error('User already Exists');
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email,
                    name,
                    avatar: '',
                    password: hashedPassword,
                    blogList: [],
                });
                const savedUser = await newUser.save() as IModel & { avatar: string };
                const { token, refreshToken } = setTokens(savedUser.id);
                return {
                    userId: savedUser.id,
                    avatar: savedUser.avatar,
                    token,
                    refreshToken,
                    tokenExpiration: 1
                };
            }
        } catch (error) {
            throw error;
        }
    },
    updateUser: async (parent: any, { userId, update }: IUpdateUser, context: Context<IAuth>) => {
        authValidation(context);

        try {
            const user = await User.findByIdAndUpdate(userId, update, {
                new: true
            }) as IModel;
            return addTimeStamp(user);
        } catch (error) {
            throw error;
        }
    }
};

/**
 * User Blogs
 */

const UserBlogs = {
    blogList: async ({ _id }: { _id: string }) => {
        authValidation({ isAuth: !!_id });
        try {
            const blog = await Blog.find({ creatorId: _id }) as IModel[];
            return [...blog].map(addTimeStamp);
        } catch (error) {
            throw error;
        }
    },
}

export { UserQueries, UserMutation, UserBlogs };
