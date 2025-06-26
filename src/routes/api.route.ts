import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { createUserSchema, loginUserSchema } from "../validations/user.schema.js";

const router = express.Router();

router.post('/auth/register', validate({body: createUserSchema}), authController.register);
router.post('/auth/login', validate({body: loginUserSchema}), authController.login);

export default router;