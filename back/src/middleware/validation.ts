import jwt from 'jsonwebtoken';
import config from '../../config';
import { ApolloError } from 'apollo-server'

export const validateToken = (token: string) => {
    try {
        return jwt.verify(token, config.jwtSecret as string);
    } catch {
        return null;
    }
}

export const validateRefreshToken = (refreshToken: string) => {
    try {
        return jwt.verify(refreshToken, config.jwtRefreshSecret as string);
    } catch {
        return null;
    }
}

export const authValidation = (context: { isAuth : boolean }) => {
    if (!context.isAuth) {
        throw new ApolloError('Non Authenticated', '401');
    }
}
