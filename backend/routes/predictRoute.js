// routes/predictRoutes.js
import express from "express";
const router = express.Router();
import { getPrediction } from '../controllers/predictController.js';


router.post('/model/predict', getPrediction);

export default router;
