import User from "../models/user.model.js"; // Capitalized to match convention
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, phoneNumber } = req.body;

    // Check if all fields are present
    if (!fullName || !email || !password || !role || !phoneNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
    });

    // Respond with success message
    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login an existing user
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if all fields are present
    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Compare the provided password with the stored hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Check if the role matches
    if (user.role !== role) {
      return res.status(400).json({ error: "User role does not match" });
    }

    // Generate JWT token if all checks pass
    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Remove sensitive information from the user object
    const userInfo = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profilePic: user.profilePic,
    };

    // Respond with the token and user information
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        user: userInfo,
        auth: true,
        message: `Login Successful, Welcome ${user.fullName}`,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout the user
export const logoutUser = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout Successful",
      success: true,
      auth: false,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, bio, skill } = req.body;
    const file = req.file;
    if (!fullName || !phoneNumber || !email || !bio || !skill) {
      return res.status(400).json({ error: "All fields are required" });
    } else {
      const skillsArray = skill.split(",");
      const userId = req.id; //Middleware authentication
      let user = await User.findById(userId);

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
    }
    //Update user profile
    user.fullName = fullName;
    user.phoneNumber = phoneNumber;
    user.email = email;
    user.profile.bio = bio;
    user.profile.skills = skillsArray;

    //Resume comes later here

    //Save the updated user
    await user.save();

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profile: {
        bio: user.profile.bio,
        skills: user.profile.skills,
      },
    };
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: user,
    });
  } catch (error) {}
};
