import express from "express";
import {
  loginHandler,
  registerHandler,
  testHandler,
  forgotpasswordHandler,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Register route post method

router.post("/register", registerHandler);

//login route post method
router.post("/login", loginHandler);

//forgotpassword route
router.post("/forgotpassword", forgotpasswordHandler);

//test route for working on middlewares
router.get("/test", requireSignIn, isAdmin, testHandler);

//protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/update-profile", requireSignIn, updateProfileController);

router.get("/orders", requireSignIn, getOrdersController);

router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
export default router;
