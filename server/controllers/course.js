import courseService from "../services/course.js";

const createSchedule = async(req,res) =>{
    const courses = await courseService.createSchedule();
    res.status(200).send(courses);
}


export default {createSchedule}