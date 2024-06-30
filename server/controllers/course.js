import courseService from "../services/course.js";

const createSchedule = async(req,res) =>{
    const chat = await courseService.createSchedule(req.body);
    res.status(200).send(chat);
}


export default {createSchedule}