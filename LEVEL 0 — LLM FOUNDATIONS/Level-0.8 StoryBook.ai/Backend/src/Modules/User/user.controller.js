import sendResponse from '../../Common/sendResponse.js';
import { getAuthCookieOptions } from '../../Common/authCookieOptions.js';
import userModel from './user.model.js';
import userUtils from './user.utils.js';
import sotryModel from '../Story/story.model.js';
import poemCreationModel from '../Poem/poem.model.js';

/**
 * @desc    Register a new user for storybook.ai
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a username, email, and password.',
      });
    }


    const existingUser = await userModel.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      const conflictField = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
      return sendResponse.sendErrorResponse({
        res,
        statusCode: 403,
        message: `${conflictField} is already registered.`,
        errorMessage: "User already exist with email"
      })
    }

    const newUser = await userModel.create({
      username,
      email,
      password,
      avatar: avatar || '',
    });

    const token = userUtils.generateToken({ id: newUser._id, tier: newUser.tier });

    return res
      .status(201)
      .cookie('token', token, getAuthCookieOptions())
      .json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: newUser,
      });

  } catch (error) {
    console.error('Registration Error:', error);

    if (error.name === 'ValidationError') {
      const validationMessages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: validationMessages[0],
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(409).json({
        success: false,
        message: `This ${field} is already registered.`,
      });
    }

    if (error.message?.includes('JWT_SECRET')) {
      return res.status(500).json({
        success: false,
        message: 'Server auth is misconfigured. Contact support.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error encountered during registration. Please try again later.',
    });
  }
};




/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both an email and a password.',
      });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }


    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }


    const token = userUtils.generateToken({ id: user._id, tier: user.tier });

    res.cookie('token', token, getAuthCookieOptions());
    await userModel.findByIdAndUpdate(user._id, {
      $inc: { Streak: 1 },
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user,
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error encountered during login. Please try again later.',
    });
  }
};



/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/v1/auth/me
 * @access  Private (Requires authentication middleware)
 */
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }


    return res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {
    console.error('GetMe Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error encountered while fetching profile.',
    });
  }
};


export const getRecentWorks = async (req, res) => {
  try {
    const userId = req.user.id;

    const [recentStories, recentPoems] = await Promise.all([
      sotryModel.find({ userId }).sort({ createdAt: -1 }).limit(3).lean(),
      poemCreationModel.find({ userId }).sort({ createdAt: -1 }).limit(3).lean()
    ]);

    const formattedStories = recentStories.map(story => ({
      title: story.title,
      type: "Story",
      createdAt: story.createdAt
    }));

    const formattedPoems = recentPoems.map(poem => ({
      title: poem.title,
      type: "Poem",
      createdAt: poem.createdAt
    }));

    const recentWorks = [...formattedStories, ...formattedPoems]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    return res.status(200).json({
      success: true,
      data: recentWorks
    });

  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: err?.message
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    // Basic authorization check
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.'
      });
    }

    const [totalUsers, totalStories, totalPoems] = await Promise.all([
      userModel.countDocuments(),
      sotryModel.countDocuments(),
      poemCreationModel.countDocuments()
    ]);

    // Aggregate total streaks across all users
    const streakData = await userModel.aggregate([
      {
        $group: {
          _id: null,
          totalStreaks: { $sum: "$Streak" }
        }
      }
    ]);
    
    const totalStreaks = streakData.length > 0 ? streakData[0].totalStreaks : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStories,
        totalPoems,
        totalStreaks
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching admin stats",
      error: err?.message
    });
  }
};