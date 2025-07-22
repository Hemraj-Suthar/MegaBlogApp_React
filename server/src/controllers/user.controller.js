import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '30m'});
    return token;
};

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username ||!email ||!password) {
        return res.status(400).json({
            success: false,
            message: 'Username, email, and password are required.',
        });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(409).json({
                success: false,
                message: 'User already exists.',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = generateToken(newUser._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60 * 1000,
            sameSite: 'Lax', // Protects against CSRF attacks
            path: '/', // Cookie is valid for all paths
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            user: { _id: newUser._id, username: newUser.username, email: newUser.email },
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required.',
        });
    }

    try {
        const userExit = await User.findOne({ email });

        if (!userExit) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        const isMatch = await bcrypt.compare(password, userExit.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password.',
            });
        }

        const token = generateToken(userExit._id);

        // Set JWT as an HttpOnly cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
            maxAge: 30 * 60 * 1000,
            sameSite: 'Lax', // Protects against CSRF attacks
            path: '/', // Cookie is valid for all paths
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            user: { _id: userExit._id, username: userExit.username, email: userExit.email },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};

// const getCurrentUser = async (req, res) => {
//     let token;
//     console.log("in getCurrentuser");
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             console.log("token", token);
            
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             const user = await User.findById(decoded.id).select('-password');

//             res.json(user);
//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };

const getCurrentUser = async (req, res) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID and exclude the password
            const user = await User.findById(decoded.id).select('-password');

            if (!user) return res.status(404).json({ message: 'User not found' });

            return res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
            });

        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};


const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const logout = async (req, res) => {
    // Clear the HttpOnly JWT cookie
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // Set expiry to past date to delete the cookie
        path: '/',
    });

    return res.status(200).json({
        success: true,
        message: 'Logout successful.',
    });
};

export { login, signup, logout, getCurrentUser, protect };
