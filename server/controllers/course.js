import courseService from "../services/course.js";

const getCourses = async(req,res) =>{
    const courses = await courseService.getCourses();
    res.status(200).send(courses);
}

const createSolutions = async(req,res) => {
    try {
        const solutions = await courseService.createSolutions(req.body);
        res.status(200).json(solutions); // Send the JSON response to the client
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
}

const getDependencies = async(req,res) => {
    try {
        const dependencies = await courseService.getDependencies(req.body);
        res.status(200).json(dependencies); // Send the JSON response to the client
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
}

const getNames = async(req,res) => {
    try {
        const names = await courseService.getNames(req.body);
        res.status(200).json(names); // Send the JSON response to the client
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
}

export default {getCourses,createSolutions, getDependencies, getNames}