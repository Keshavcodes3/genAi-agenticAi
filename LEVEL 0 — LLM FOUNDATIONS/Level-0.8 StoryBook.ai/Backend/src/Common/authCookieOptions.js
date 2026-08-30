export const getAuthCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        expires: new Date(
            Date.now() + (parseInt(process.env.COOKIE_EXPIRE, 10) || 7) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    };
};
