import express from "express";
const router = express.Router();
import { evaluateDiagnostic }  from '../controllers/diagnosticController.js';

router.post('/model/diagnostic', evaluateDiagnostic);
 
//DiagnosticRoute
export default router;