import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const chatUser = new Schema ( {
    'username': {
        type: String,
        required: true
    },
    'displayName': {
        type: String, 
        required: true
    },
    'profilePic': {
        type: String,
        required: false
    }


});

export default mongoose.model('chatUser', chatUser);