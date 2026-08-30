import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
            index: true,
        },
        name: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: '',
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'light',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please fill a valid email address',
            ],
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
            select: false,
        },
        avatar: {
            type: String,
            default: '',
        },
        Streak: {
            type: Number,
            default: 0,
            select: false
        },
        totalPoems: {
            type: Number,
            default: 0,
        },
        totalStoriesWritten: {
            type: Number,
            default: 0,
        },
        tier: {
            type: String,
            enum: ['free', 'premium'],
            default: 'free',
            select: false
        },
        generationCredits: {
            type: Number,
            default: 20,
        },
        savedCreations: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Creation',
            },
        ],
    },
    {
        timestamps: true,
    }
);


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    },
});

const userModel = mongoose.model('User', userSchema);


export default userModel;