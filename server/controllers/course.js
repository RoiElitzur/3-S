import courseService from "../services/course.js";

const getCourses = async(req,res) =>{
    const courses = await courseService.getCourses();
    res.status(200).send(courses);
}

const createSolutions = async(req,res) => {
    const solutions = await courseService.createSolutions(req.body);
    res.status(200).send(solutions);
}

export default {getCourses,createSolutions}