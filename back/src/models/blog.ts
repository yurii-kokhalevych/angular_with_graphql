import mongoose from 'mongoose';

/**
 * Blog Schema
 */
const blogSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        creatorId: {
            type: String
        },
        name: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Blog', blogSchema);
