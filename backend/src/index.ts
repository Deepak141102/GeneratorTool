import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import winston from "winston";
import routes from './routes/index.js';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000');

// Configure CORS to allow credentials and specify the frontend origin
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_BASE_URL, // Frontend URL from environment variable
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    })
);

// Parse incoming requests with JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session middleware to manage user sessions
app.use(
    session({
        secret: process.env.COOKIE_SECRET!, // Session secret from environment variable
        cookie: {
            secure: process.env.NODE_ENV === "production", // Secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-domain handling
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiry
        },
        resave: false,
        saveUninitialized: false,
    })
);

// Initialize Passport.js for authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth strategy for Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!, // Google Client ID from environment variable
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Google Client Secret from environment variable
    callbackURL: `https://genbackend.onrender.com/auth/google/callback`, // Ensure this matches Google Console
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile); // Return the user profile from Google
}));

// Serialize user information into session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user information from session
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Winston logger configuration for request logging
export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            (data) => `${data.timestamp} ${data.level}: ${data.message}`
        )
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
});

// Logging middleware for all requests
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Received a ${req.method} request for ${req.url}`);
    next();
});

// Health check route to ensure the server is running
app.get('/health', (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.sendStatus(200);
});

// Mount application routes
app.use(routes);

// Route for Google OAuth login
app.get("/auth/google",
    passport.authenticate("google", {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    })
);

// OAuth callback route for Google login
app.get('/auth/google/callback',
    passport.authenticate("google", {
        session: true,
        failureRedirect: '/login', // Redirect to login page on failure
    }),
    (req, res) => {
        // Redirect to the frontend base URL on successful login
        res.redirect(`${process.env.FRONTEND_BASE_URL}`);
    }
);

// Route to log out and destroy the session
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.status(200).json({ message: 'Logged out successfully!' });
    });
});

// Route to get the authenticated user's profile
app.get('/user', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(req.user);
});

// Start the server
const server = app.listen(PORT, () => {
    logger.info(`Server listening at http://localhost:${PORT}`);
});

// Global error handler to log errors and redirect to frontend
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    logger.error(err.message);
    res.redirect(`${process.env.FRONTEND_BASE_URL}`);
});

// Handle uncaught exceptions and shut down the server gracefully
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    server.close(() => {
        process.exit(1);
    });
});
