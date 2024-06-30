import Course from '../models/course.js'


const createSchedule = async (info) =>
{
    const courses = info.courses;
    const wantedCourses = await Course.find({ courseNum: { $in: info } });
    //createDocument;
    //execvp(Python);
    return wantedCourses;
}


export default {createSchedule}