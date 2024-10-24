const cors = require('cors');

const allowedOrigins = [
    'http://localhost:4200',
    'https://secret-santa-6q4v60h5a-froggys974s-projects.vercel.app',
    'https://secret-santa-4kqtw6fv7-froggys974s-projects.vercel.app',
    '/^https:\/\/secret-santa-[a-z0-9]+-froggys974s-projects\.vercel\.app$/',
    'https://frontend-seven-sigma-69.vercel.app'
    
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error(`${origin} Not allowed by CORS`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
