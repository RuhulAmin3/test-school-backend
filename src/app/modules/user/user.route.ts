import { validationRequest } from "./../../middlewares/validationRequest";
import express from "express";
import {
  getAllUserController,
  getSingleUserController,
  updateUserController,
  deleteUserController,
} from "./user.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/enum";
import { updateProfileZodSchema } from "../auth/auth.validation";
const router = express.Router();

router.get("/", auth(USER_ROLE.ADMIN), getAllUserController);

router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPERVISOR, USER_ROLE.STUDENT),
  getSingleUserController
);

router.patch(
  "/:id",
  validationRequest(updateProfileZodSchema),
  auth(USER_ROLE.ADMIN),
  updateUserController
);

router.delete("/:id", auth(USER_ROLE.ADMIN), deleteUserController);

export default router;
