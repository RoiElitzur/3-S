import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const FireBaseToken = new Schema ( {
    'username': {
        type: String,
        required: true
    }, 
    'token': {
        type: String,
        required: true
    }

});

// module.exports = mongoose.model('User', User);
export default mongoose.model('FireBaseToken', FireBaseToken);