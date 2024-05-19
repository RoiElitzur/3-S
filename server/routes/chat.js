import express from 'express'

// import {createChat,getChat,getChatsbyUsername,checkIfChatExist,deleteChat, addMassage ,getMassages} from '../controllers/chat.js'
import chatController from '../controllers/chat.js'
import userController from '../controllers/user.js'
const router = express.Router();
router.get('/',userController.isLoggedIn, chatController.getChatsbyUsername);
router.post('/',userController.isLoggedIn,chatController.createChat);
router.get('/:id',userController.isLoggedIn, chatController.getChat);
router.delete('/:id',userController.isLoggedIn, chatController.deleteChat);
router.post('/:id/Messages',userController.isLoggedIn,chatController.addMassage)
router.get('/:id/Messages',userController.isLoggedIn, chatController.getMassages)

export default router;