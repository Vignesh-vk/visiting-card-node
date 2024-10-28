const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db.js');
const cardRoutes = require('./routes/cardRoute.js');

const dotenv = require('dotenv');

dotenv.config();
const app = express();

connectDB();

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,
}));

app.use(bodyParser.json());

// app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    res.send('Welcome to Visiting card scanner!');
});

app.use('/api', cardRoutes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
