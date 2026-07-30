const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, User, Company } = require('../models/index');
const { sendVerificationLink } = require('../utils/firebaseAuth');
const asyncHandler = require('../utils/asyncHandler');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, companyName, companyDescription, companyLocation, companyWebsite } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await sequelize.transaction(async (t) => {
    const newUser = await User.create(
      { name, email, password: hashedPassword, role },
      { transaction: t }
    );

    if (role === 'JobProvider') {
      await Company.create(
        {
          name: companyName,
          description: companyDescription,
          location: companyLocation,
          website: companyWebsite,
          userId: newUser.id,
        },
        { transaction: t }
      );
    }

    return newUser;
  });

  await sendVerificationLink(email);

  res.status(201).json({
    message: 'Verification link sent to your email. Please check your inbox.',
    email: user.email,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error('Invalid password');
  }

  if (!user.isVerified) {
    await sendVerificationLink(user.email);
    return res.status(403).json({
      message: 'Email not verified. A new verification link has been sent to your email.',
    });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = { registerUser, loginUser };