import express from "express";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public route
const authUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      subscription: user.subscription,
      // email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});
// @desc get user profile
// @route get /api/users/profile
// @access private route

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      subscription: user.subscription,
      // email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  console.log(req,user.id,"update")
  const user = await User.findById(req.user._id);
  if (user) {
    user.subscription = req.body.subscription || user.subscription;


    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      subscription:updateUser.subscription,
      // email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});
// @desc registeruser
// @route POST /api/users/
// @access Public route
const registerUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
console.log(name,password)
  const userExist = await User.findOne({ name });

  if (userExist) {
    res.status(400);
    throw new Error("Useralreadyexists");
  }
  const user = await User.create({
    
    name,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
});

// @desc get all users
// @route get /api/users
// @access private/Admin

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc DELETE USER
// @route get /api/users/:id
// @access private/Admin

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc get user by ID
// @route get /api/users/:id
// @access private/Admin

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc update user
// @route PUT /api/users/:id
// @access private/Admin

const updateUser = asyncHandler(async (req, res) => {
  console.log(req.params.id,"id",req.body)
  const user = await User.updateOne({_id:req.params.id},{$push:{subscription:req.body}});
  if (user) {
    
    res.json(user);
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
