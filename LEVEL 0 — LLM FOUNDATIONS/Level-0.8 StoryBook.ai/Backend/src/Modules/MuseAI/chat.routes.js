import express from 'express';
import { startChat, retriveContent, sendMessage, getMemory } from './chat.controller.js';
import { protect } from '../../Middlewares/protect.js';

const chatRoutes = express.Router();

chatRoutes.post('/start', protect, startChat);
chatRoutes.get('/retrieve', protect, retriveContent);
chatRoutes.post('/send', protect, sendMessage);
chatRoutes.get('/memory', protect, getMemory);

export default chatRoutes;
