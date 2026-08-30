import express from 'express';
import { processEditorAiAction, syncStory } from './editor.controller.js';
import { protect } from '../../Middlewares/protect.js';

const editorRoutes = express.Router();

editorRoutes.post('/ai-action', protect, processEditorAiAction);
editorRoutes.put('/sync', protect, syncStory);

export default editorRoutes;
