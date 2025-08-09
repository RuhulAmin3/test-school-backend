import { validationRequest } from "./../../middlewares/validationRequest";
import express from "express";
import {
  getAllUserController,
  getSingleUserController,
  updateUserController,
  deleteUserController,
  profileController,
  updateProfileController,
} from "./user.controller";
import { updateUserZodSchema, updateProfileZodSchema } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/enum";
const router = express.Router();

router.get("/", auth(USER_ROLE.ADMIN), getAllUserController);
router.get(
  "/my-profile",
  auth(USER_ROLE.BUYER, USER_ROLE.SELLER),
  profileController
);

router.patch(
  "/my-profile",
  validationRequest(updateProfileZodSchema),
  auth(USER_ROLE.BUYER, USER_ROLE.SELLER),
  updateProfileController
);

router.get("/:id", auth(USER_ROLE.ADMIN), getSingleUserController);

router.patch(
  "/:id",
  validationRequest(updateUserZodSchema),
  auth(USER_ROLE.ADMIN),
  updateUserController
);

router.delete("/:id", auth(USER_ROLE.ADMIN), deleteUserController);

export default router;
