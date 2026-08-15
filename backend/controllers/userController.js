const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, User, Company } = require('../models/index');
const { sendVerificationLink, verifyIdToken } = require('../utils/firebaseAuth');
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
    throw new Error('Invalid credentials');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error('Invalid credentials');
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

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: 'Login successful',
  });
});


const verifyEmail = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  const decodedToken = await verifyIdToken(idToken);

  const user = await User.findOne({ where: { email: decodedToken.email } });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!user.isVerified) {
    user.isVerified = true;
    await user.save();
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

  res.status(200).json({
    message: 'Email verified successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const { id, name, email, role } = req.user;

  res.status(200).json({
    id,
    name,
    email,
    role,
  });
});

const getProfileById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log('Requested ID:', id);

  const user = await User.findByPk(id, {
    attributes: ['name', 'email', 'role'],
    include: [
      {
        association: 'companies',
        attributes: ['name', 'description', 'logoUrl', 'website', 'location'],
      },
    ],
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user);
});

const editProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, email, password, companyName, companyDescription, companyLocation, companyWebsite } = req.body;

  const user = await User.findByPk(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (email && email !== user.email) {
    const emailTaken = await User.findOne({ where: { email } });
    if (emailTaken) {
      res.status(400);
      throw new Error('Email already in use');
    }
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = await bcrypt.hash(password, 10);

  await user.save();

  if (user.role === 'JobProvider') {
    const company = await Company.findOne({ where: { userId: user.id } });

    if (companyName) company.name = companyName;
    if (companyDescription) company.description = companyDescription;
    if (companyLocation) company.location = companyLocation;
    if (companyWebsite) company.website = companyWebsite;

    await company.save();
  }

  res.status(200).json({
    message: 'Profile updated successfully',
  });
});

module.exports = { registerUser, loginUser, verifyEmail, getProfile,getProfileById,editProfile };