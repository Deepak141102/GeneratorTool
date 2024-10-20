import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import winston from 'winston';
import routes from './routes/index.js';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000');

// CORS configuration to allow frontend to communicate with backend
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_BASE_URL, // Allow requests from frontend URL
    })
);

app.use(express.json()); // Enable parsing JSON bodies in requests
app.use(express.urlencoded({ extended: true })); // Enable parsing URL-encoded bodies

// Session setup to store user information between requests
app.use(
    session({
        secret: process.env.COOKIE_SECRET || 'secret', // Secret key for signing the session ID cookie
        cookie: {
            secure: process.env.NODE_ENV === "production" ? true : "auto", // Secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cookie policy based on environment
            maxAge: 30 * 24 * 60 * 60 * 1000, // Session valid for 30 days
        },
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize()); // Initialize Passport for authentication
app.use(passport.session()); // Enable persistent login sessions

// Google OAuth strategy configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_BASE_URL}/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));


// Serialize user to store user data in session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Logging setup using Winston for better debugging and monitoring
export const logger = winston.createLogger({
    level: "info", // Log level set to info
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((data) => `${data.timestamp} ${data.level}: ${data.message}`)
    ),
    transports: [
        new winston.transports.Console(), // Log to the console
        new winston.transports.File({ filename: "logs/app.log" }), // Log to file
    ],
});

// Middleware to log each incoming request
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Received a ${req.method} request for ${req.url}`); // Log request method and URL
    next();
});

// Health check route to verify the backend is running
app.get('/health', (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' }); // Respond with unauthorized if no user session
    }
    res.sendStatus(200); // Return OK status if authenticated
});

app.use(routes); // Include other routes from routes/index.js

// Route to initiate Google OAuth login
app.get("/auth/google",
    passport.authenticate("google", {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ]
    })
);

// Route for Google OAuth callback after login
app.get('/auth/google/callback',
    passport.authenticate("google", { session: true }), // Authenticate the user and establish a session
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_BASE_URL}`); // Redirect to frontend homepage after successful login
    }
);

// Route to log out and clear the session
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err); // Handle logout error if any
        res.status(200).json({ message: 'Logged out successfully!' }); // Respond with successful logout message
    });
});

// Route to get the current logged-in user's profile
app.get('/user', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' }); // If no user session, return unauthorized
    }
    res.json(req.user); // Return user profile information
});

// Start the Express server and listen on specified PORT
const server = app.listen(PORT, () => {
    logger.info(`Server listening at http://localhost:${PORT}`); // Log server startup information
});

// Global error handler to catch any unhandled errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err); // Log the error
    logger.error(err.message);
    res.redirect(`${process.env.FRONTEND_BASE_URL}`); // Redirect to frontend on error
});

// Handle uncaught exceptions in the process
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err); // Log the uncaught exception
    server.close(() => {
        process.exit(1); // Gracefully shut down the server on uncaught exceptions
    });
});
