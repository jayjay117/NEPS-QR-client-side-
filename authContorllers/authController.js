// const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config()
const connection =  require('../config/connection'); // Ensure this imports your database connection

// JWT Token Creator
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SIGN, {
    expiresIn: '1d',
  });
};

// 

const SignUp = (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    businessName,
    businessCategory,
    tinNumber,
    bankName,
    accountNumber,
    pin,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password cannot be empty" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const hashedPin = bcrypt.hashSync(pin.toString(), 10);
  console.log("Hashed Password:", hashedPassword);

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";

  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.log("Error checking email:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const insertQuery = `
      INSERT INTO users (
        fullName, email, phoneNumber, businessName,
        businessCategory, tinNumber, bankName,
        accountNumber, pin, password
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      fullName,
      email,
      phoneNumber,
      businessName,
      businessCategory,
      tinNumber || null,
      bankName,
      accountNumber,
      hashedPin,
      hashedPassword
    ];

    connection.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      return res.status(201).json({ message: "User created successfully" });
    });
  });
};

const Login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password cannot be empty" });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid password" });
    }
    token = createToken(user);
    console.log("Login successful", { userId: user.id, token });
    return res.status(200).json({ message: "Login successful", userId: user.id,token, businessName: user.businessName, email: user.email, phonenumber:user.phoneNumber});
  });
};

const PINlogin = (req, res) => {
  const { email, pin } = req.body;

  if (!email || !pin) {
    return res.status(400).json({ message: "Email and pin cannot be left empty" });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    console.log("Entered PIN:", pin);
    console.log("Stored Hashed PIN:", user.pin);

    const match = bcrypt.compareSync(pin.toString(), user.pin);
    console.log("PIN Match:", match);

    if (!match) {
      return res.status(401).json({ message: "Invalid pin" });
    }
 
    return res.status(200).json({
      message: "Login successful",
      userId: user.id,
      token: createToken(user),
      businessName: user.businessName
    });
  });
};
 
const UserSignup = (req,res) =>{
  const {full_name,bvn,phone_Number,email,address,state,city,password,pin} = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password cannot be empty" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const hashedPin = bcrypt.hashSync(pin.toString(), 10);

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";

  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.log("Error checking email:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

 const insertQuery = `
  INSERT INTO clients 
  (full_name, bvn, phone_number, email, address, state, city, password, pin) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`

    const values = [
      full_name,
      bvn,
      phone_Number,
      email,
      address,
      state,
      city,
      hashedPassword,
      hashedPin,
    ];

    connection.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      return res.status(201).json({ message: "User created successfully" });
    });
  });
}

// user login
const UserLogin = (req,res)=>{
  const {email,password} = req.body
  if(!email|| !password){
    console.log(`those fields are required`)
  }
  else{
    const query = 'select * from clients where email = ?'
    connection.query(query,[email],(err,results)=>{
      if(err){
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if(results.length === 0){
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];

      if(!bcrypt.compareSync(password, user.password)){
        return res.status(401).json({ message: "Invalid password" });
      }

      token = createToken(user);
      console.log("Login successful", { userId: user.id, token, fullName: user.full_name });
      return res.status(200).json({ message: "Login successful", userId: user.id, fullname: user.full_name, email: user.email, token:token});
    })
  }
}
const UserPinLogin = (req,res)=>{
  const {email,pin} = req.body
  if(!email || !pin){
    return res.json({message: `these fields cant be left empty`})
  }
  const query = 'select * from clients where email = ?'
  connection.query(query,[email],(err,results)=>{
    if(err){
      console.error(`error fetching`);
      return res.status(500).json({message:`internal server error`})
    }
    if(results.length === 0){
      return res.status(404).json({message:`user not found`})
    }
    const user = results[0]
    if(!bcrypt.compareSync(pin,user.pin)){
      return res.json({message:`invalid pin`})
    }
    const token = createToken(user)
    console.log(token)
    return res.status(200).json({message:`welcome user`, token:token, fullname:user.full_name, email:user.email})
  })
}
// module.exports = SignUp;
module.exports = {
  SignUp,
  Login,
  PINlogin,
  UserSignup,
  UserLogin,
  UserPinLogin
};