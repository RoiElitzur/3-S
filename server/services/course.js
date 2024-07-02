import Course from '../models/course.js'


const createSchedule = async () =>
{
    const courses = await Course.find({});
    console.log(courses);
    //const wantedCourses = await Course.find({ courseNum: { $in: info } });
    //createDocument;
    //execvp(Python);
    return courses;
}


export default {createSchedule}