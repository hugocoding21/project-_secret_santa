const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoute');
const corsMiddleware = require('./utils/corsUtils'); 



require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB', err));


app.use(corsMiddleware);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("host", HOST)
app.set("port", PORT)
userRoutes(app);


module.exports = app;
