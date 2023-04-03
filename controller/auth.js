import mongoose from "mongoose";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  res.send("auth api");
};

//UserSignUp
export const userSignUp = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hashedPassword });

    await newUser.save();
    res.status(200).json("User has been created");
  } catch (err) {
    next(err);
  }
};

//UserSignIn
export const userSignIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name});
   
    if (!user) return next(createError(404, "User not found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong Credentials"));

    const token = await jwt.sign({ id: user._id }, process.env.JWT);
    const {password,...others} = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};
