import express from "express";
import {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  registerUser,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";
// import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.post("/login", authUser);
router.route("/").get(getUsers);
router
  .route("/profile")
  .get(getUserProfile)
  .put(updateUserProfile);

router
  .route("/:id")
  .delete( deleteUser)
  .get( getUserById)
  .put( updateUser);
export default router;
