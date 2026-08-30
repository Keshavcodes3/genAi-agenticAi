import mongoose from 'mongoose';

const creationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A creation must belong to a registered user.'],
            index: true, 
        },
        title: {
            type: String,
            trim: true,
            default: 'Untitled Masterpiece',
            maxlength: [100, 'Title cannot exceed 100 characters.'],
        },
        format: {
            type: String,
            required: [true, 'Format type (story/poetry) is required.'],
            enum: {
                values: ['story', 'poetry'],
                message: 'Format must be either story or poetry.',
            },
        },
        mood: {
            type: String,
            required: [true, 'Mood parameter is required.'],
            trim: true,
            lowercase: true,
        },
        genre: {
            type: String,
            required: [true, 'Genre parameter is required.'],
            trim: true,
            lowercase: true,
        },
        userPrompt: {
            type: String,
            required: [true, 'The base description or concept is required.'],
            trim: true,
            maxlength: [700, 'Prompt description cannot exceed 500 characters.'],
        },
        generatedText: {
            type: String,
            required: [true, 'Generated text content cannot be empty.'],
        },
        isBookmarked: {
            type: Boolean,
            default: false,
        },
    },
    {

        timestamps: true,
    }
);

creationSchema.index({ userId: 1, format: 1 });

const sotryModel = mongoose.model('storyCreation', creationSchema);


export default sotryModel;