import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const decodeJWT = await JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decodeJWT;
    console.log(decodeJWT);
    next();
  } catch (err) {
    console.log(err);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    console.log(user);
    if (user.roles !== 1) {
      console.log(user.roles);
      console.log("not authorized");
      res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    } else {
      console.log(user.roles);
      console.log(" authorized");
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
