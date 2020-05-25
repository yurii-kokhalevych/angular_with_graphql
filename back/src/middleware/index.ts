import { validateToken, validateRefreshToken } from './validation'
import { setTokens } from './setToken'
import { User } from '../models';


export default async (req: any, res: any, next: any) => {
    const authHeader = req.get('Authorization')
    const authRefresh = req.get('Refresh')

    if (!authHeader && !authRefresh) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader ? authHeader.split(' ')[1] : '';
    const refreshToken = authRefresh || '';


    if (!token && !refreshToken || token === '' && refreshToken === '') {
        req.isAuth = false;
        return next();
    }
    const decodedToken = validateToken(token) as { user: { userId : string }}

    if (decodedToken) {
        req.userId = decodedToken.user.userId;
        req.isAuth = true;
        return next()
    }
    const decodedRefreshToken = validateRefreshToken(refreshToken) as any

    if (decodedRefreshToken) {
        const user = await User.findById(decodedRefreshToken.user.userId);
        // valid user and user token not invalidated
        if (!user || user._id.toString() !== decodedRefreshToken.user.userId.toString()) {
            throw new Error('Non Authenticated');
        }
        req.isAuth = true;
        req.userId = decodedRefreshToken.user.userId;
        const userTokens = setTokens(user.id);

        res.set({
            Authorization: `Bearer ${userTokens.token}`,
            Refresh: userTokens.refreshToken
        });
        return next();
    }
    req.isAuth = false;
    return next();
};
