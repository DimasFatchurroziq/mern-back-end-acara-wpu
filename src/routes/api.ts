import express from "express";
import dummyController from "../controllers/dummy.controller.js";

const router = express.Router();

router.get('/', dummyController.dummy);

export default router;