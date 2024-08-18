import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Course = new Schema ({
        'courseNum': {
            type: String,
            required: true
        },
        'courseName':{
            type: String,
            required: true
        },
        dependencies: {
            type: [String], // Change to array of strings
            required: false
        },
        conflicts: {
            type: [String], // Change to array of strings
            required: false
        }
    }
);

export default mongoose.model('Course', Course);

//{"89-110","89-1111","89-112","89-113","89-1200","89-132","89-133","89-1195","89-1262"}
//  { "courseNum": "XX 89-4", "courseName": "סמינריון", "dependencies": ["89-110","89-1111","89-112","89-113","89-1200","89-132","89-133","89-1195","89-1262", "89-362", "89-263"] },