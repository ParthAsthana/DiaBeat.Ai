const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://aniket:aniketdcst@cluster0.y32diki.mongodb.net/user-data?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("We're connected to the database!");
});

// Updated User Authentication Schema
const AuthUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});
const AuthUser = mongoose.model('AuthUser', AuthUserSchema);

// Existing Health Data Schema
const UserSchema = new mongoose.Schema({
  Pregnancies: Number,
  Glucose: Number,
  BloodPressure: Number,
  SkinThickness: Number,
  Insulin: Number,
  BMI: Number,
  DiabetesPedigreeFunction: Number,
  Age: Number,
  Diabetes: String
});
const User = mongoose.model('User', UserSchema);

app.get('/health', (req, res) => {
  res.send('Server is healthy');
});

app.get('/users/:_id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  User.findById(req.params._id)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    });
});

app.post('/predict', (req, res) => {
  console.log('Received a prediction request with data:', req.body);

  var dataToSend;
  const python = spawn('python', ['./MLModels/predict.py',
    req.body.Pregnancies, req.body.Glucose, req.body.BloodPressure,
    req.body.SkinThickness, req.body.Insulin, req.body.BMI,
    req.body.DiabetesPedigreeFunction, req.body.Age]);

  python.stdout.on('data', function (data) {
    console.log('Received data from Python script:', data);
    dataToSend = data.toString();
  });

  python.on('close', (code) => {
    console.log(`Python script closed with code ${code}`);
    res.send({ result: dataToSend });
  });
});

// Register Route for Health Data
app.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save()
    .then((user) => {
      console.log('Data saved successfully:', user);
      res.json({ message: 'Data saved successfully', data: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: 'Failed to save data' });
    });
});

// Updated Signup Route
app.post('/SignUp', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new AuthUser({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    const result = await user.save();

    const token = jwt.sign({ _id: result._id }, 'your_secret_key');
    res.send({ message: 'Registered successfully', token });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Serve the signup form
app.get('/SignUp', (req, res) => {
  const signupForm = 
    <form method="POST" action="/SignUp">
      <h3>Sign Up</h3>
      <div>
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required>
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>
      </div>
      <button type="submit">Sign Up</button>
    </form>;
  res.send(signupForm);
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
