import  jwt  from 'jsonwebtoken';

export const checkAuth = (req,res,next) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
        if (!token) {
            return res.status(403).json({message: "Пользователь не авторизован"})  
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.id;
        next();

    } catch (e) {
        console.log(e);
        return res.status(403).json({message: "Пользователь не авторизован"})   
    }
}