import express from 'express'
import courseController from '../controllers/course.js';
const router = express.Router();


router.post('/', courseController.createSchedule);



export default router;