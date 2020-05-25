import mongoose from 'mongoose';

/**
 * User Schema
 */
const userSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            min: 4,
            max: 32
        },
        avatar :{
            type: String,
        },
        blogList: {
            type: Array
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', userSchema);
