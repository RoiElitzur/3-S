import express from 'express'
import courseController from '../controllers/course.js';
const router = express.Router();


router.get('/', courseController.createSchedule);



export default router;