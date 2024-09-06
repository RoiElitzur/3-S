import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    courseNum: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    dependencies: {
        type: [String], // Array of strings for dependencies
        required: false
    },
    conflicts: {
        type: [String], // Array of strings for conflicts
        required: false
    },
    day: {
        type: String, // Add day if it's a part of the course data
        required: false
    },
    startTime: {
        type: String, // Add startTime if it's a part of the course data
        required: false
    },
    endTime: {
        type: String, // Add endTime if it's a part of the course data
        required: false
    },
    semester: {
        type: String, // Add semester if it's a part of the course data
        required: false
    },
    index: {
        type: String, // Add index if it's a part of the course data
        required: false
    },
    year: {
        type: String, // Add year if it's a part of the course data
        required: false
    }
});

export default mongoose.model('Course', CourseSchema);
