import jwt from 'jsonwebtoken';
import config from '../../config';

export const setTokens = (userId: string) => {
    const oneDay = '1d';
    const tenMinutes = '10m';
    const accessUser = {
        userId
    };
    const token = jwt.sign(
        { user: accessUser },
        config.jwtSecret as string,
        {
            expiresIn: tenMinutes
        }
    );
    const refreshToken = jwt.sign(
        { user: accessUser },
        config.jwtRefreshSecret as string,
        {
            expiresIn: oneDay
        }
    );

    return { token, refreshToken };
}
