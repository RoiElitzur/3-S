import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const User = new Schema ( {
    'username': {
        type: String,
        required: true
    }, 
    'password': {
        type: String,
        required: true
    },
    'email': {
        type: String, 
        required: true
    }
});

// module.exports = mongoose.model('User', User);
export default mongoose.model('User', User);