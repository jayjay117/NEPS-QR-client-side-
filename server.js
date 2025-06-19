// const sql = require(`mysql`)
const express = require(`express`);
const bodyParser = require(`body-parser`);
const cors = require(`cors`);
const dotenv = require(`dotenv`);
const authRoutes = require('./routes/authRoutes'); // Ensure this imports your auth routes
require('./config/connection'); 
dotenv.config()

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', authRoutes); // Use the auth routes

app.get('/', (req, res) => {
  res.send('API is working');
});

app.listen(3000,() => {        
    console.log(`the server is running on port 3000`)
})