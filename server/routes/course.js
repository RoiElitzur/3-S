import express from 'express'
import courseController from '../controllers/course.js';
const router = express.Router();


router.get('/', courseController.getCourses);
router.post('/',courseController.createSolutions)
router.post('/dependencies',courseController.getDependencies)



export default router;