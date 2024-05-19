import express from 'express'

import userController from '../controllers/user.js';
import userService from '../services/user.js';
const router = express.Router();


router.post('/', userController.isUsernameAndPasswordValid);
router.post('/firebase', userController.saveFirebaseToken);




export default router;