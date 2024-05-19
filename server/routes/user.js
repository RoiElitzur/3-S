import express from 'express'
// import {createUser, isUsernameAndPasswordValid, getUser} from '../controllers/user.js';
import userController from '../controllers/user.js';
const router = express.Router();


router.post('/', userController.createUser);
router.get('/:username', userController.getUser);






export default router;