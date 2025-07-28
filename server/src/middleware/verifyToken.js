import jwt from 'jsonwebtoken';


const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is missing."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

export default verifyToken; 

