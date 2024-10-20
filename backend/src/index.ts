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

// CORS Configuration
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_BASE_URL, // Use your frontend base URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(
    session({
        secret: process.env.COOKIE_SECRET!,
        cookie: {
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // None for cross-origin requests
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        },
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `https://genbackend.onrender.com/auth/google/callback`, // Ensure this matches Google Console
}, (accessToken, refreshToken, profile, done) => {
    // Save or update user info in database here if needed
    return done(null, profile);
}));

// Serialize user into session
passport.serializeUser((user: any, done) => {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser((obj: any, done) => {
    done(null, obj);
});

// Logger setup using Winston
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

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Received a ${req.method} request for ${req.url}`);
    next();
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.sendStatus(200);
});

app.use(routes);

// Google OAuth Routes
app.get("/auth/google",
    passport.authenticate("google", {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    })
);

// Google OAuth Callback
app.get('/auth/google/callback',
    passport.authenticate("google", { session: true, failureRedirect: '/login' }),
    (req, res) => {
        // Redirect after successful login
        res.redirect(`${process.env.FRONTEND_BASE_URL}`);
    }
);

// Logout Route
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.status(200).json({ message: 'Logged out successfully!' });
    });
});

// Route to get current logged-in user profile
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

// Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    res.status(500).json({ error: 'An error occurred, please try again later.' });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    server.close(() => {
        process.exit(1);
    });
});
