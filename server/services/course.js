import Course from '../models/course.js'


const getCourses = async () =>
{
    const courses = await Course.find({});
    console.log(courses);

    return courses;
}
const createSolutions = async (data) => {
    //const wantedCourses = await Course.find({ courseNum: { $in: info } });
    //createDocument;
    //execvp(Python);
    console.log('createSolutions');
    console.log(data)
    return;
}

export default {getCourses,createSolutions}