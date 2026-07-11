const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');
const functions = require('firebase-functions');
const { onRequest } = require("firebase-functions/v2/https");


require('dotenv').config();


const app = express();

app.use(cors({ origin: 'http://localhost:8081', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => res.send('API is running'));

exports.helloWorld = onRequest((req, res) => {
  res.send("Hello World");
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));


// exports.api = functions.https.onRequest(app);
