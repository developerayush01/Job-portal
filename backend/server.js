require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/dbConfig");
const { sendVerificationLink } = require('./utils/firebaseAuth');
const errorHandler = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');


const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

connectDB();

app.get("/", (req, res) => {
  res.send("Backend");
});


app.post('/api/test-firebase', async (req, res) => {
  try {
    const { email } = req.body;
    await sendVerificationLink(email);
    res.status(200).json({ message: 'Verification link sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
app.use('/api/users', userRoutes);

app.use(errorHandler);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
