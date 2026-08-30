import jwt from 'jsonwebtoken'



const generateToken = ({ id, tier = 'free' }) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured on the server');
    }

    return jwt.sign(
        { id, tier },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};





const userUtils={
    generateToken
}


export default userUtils