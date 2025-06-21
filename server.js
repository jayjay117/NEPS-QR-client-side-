// const sql = require(`mysql`)
const express = require(`express`);
const bodyParser = require(`body-parser`);
const cors = require(`cors`);
const dotenv = require(`dotenv`);
const authRoutes = require('./routes/authRoutes'); // Ensure this imports your auth routes
const connection = require('./config/connection'); 
dotenv.config()

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', authRoutes); // Use the auth routes

app.get('/', (req, res) => {
  res.send('API is working');
});
app.get("/test-db", (req, res) => {
  connection.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ db: "connected", result: results[0].result });
  });
});


app.listen(3000,() => {        
    console.log(`the server is running on port 3000`)
})