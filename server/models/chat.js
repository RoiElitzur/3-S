import User from './user.js'
import Massage from './massage.js'
import chatUser from './chatUser.js';
import mongoose from 'mongoose';
// const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
const Chat = new Schema ( {
    "users":
         {
        type:[{'username': {
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
        }}]
        
    }
   ,
    "messages": { type:[ {
        'created': {
            type: Date, 
            default: Date.now
        },
        'sender': {
            type:{'username': {
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
            }}
        },
        'content':{
            type: String,
            default: ""
        }
    }]}
});

export default mongoose.model('Chat', Chat);


// "users": {
//     type: [{
//         type: Schema.Types.ObjectId,
//         ref: 'chatUser'
//       }], 
    
// }

// type: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Massage'
//   }]        