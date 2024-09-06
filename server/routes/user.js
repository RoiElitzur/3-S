import express from 'express'
import userController from '../controllers/user.js';
const router = express.Router();


router.post('/', userController.createUser);
router.post('/validation', userController.isUsernameAndPasswordValid);






export default router;