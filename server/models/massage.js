import User from './user.js'
import mongoose from 'mongoose';
// import autoIncrement from 'mongoose-auto-increment';
// const autoIncrement = require('mongoose-auto-increment');
// import autoIncrement from 'mongoose-auto-increment';
// autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
const Massage = new Schema ( {
    created: {
        type: Date, 
        default: Date.now
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content:{
        type: String,
        default: ""
    }
});

// Message.plugin(autoIncrement.plugin, {
//     model: 'Message',
//     field: 'id',
//     startAt: 1 
// });
// module.exports = mongoose.model('Massage',Massage);
export default mongoose.model('Massage', Massage);