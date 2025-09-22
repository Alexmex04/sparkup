import express from "express";
import {
    createMLData
} from "../controllers/MLController.js";

const router = express.Router();

router.post('/modelData', createMLData);

export default router;