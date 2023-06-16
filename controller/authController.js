import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import OrderModel from "../models/OrderModel.js";
import { comparePassword, hashPassword } from "../utils/authUtil.js";

export const registerHandler = async (req, res) => {
  try {
    // console.log("hello");
    const { name, email, password, phone, address, answer } = req.body;
    //just a server side validation:
    //if there is no name or email or any other required field
    //return an error meesage
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is required" });
    }
    if (!address) {
      return res.send({ error: "Address is required" });
    }
    if (!answer) {
      return res.send({ error: "Security Answer is required" });
    }
    //check if user is already existed
    const existingUser = await userModel.findOne({ email });
    //if user is already present
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User is already registered",
      });
    }
    //if it is a new user
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "user successfully registered",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Registration unsuccessful",
      error,
    });
  }
  //   console.log("executing code for registering user");
};

export const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    //validating email and password at server side
    if (!email || !password) {
      //   console.log("no email and password");
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check if user is already registered by checking email in the database
    const user = await userModel.findOne({ email });
    console.log(user);
    // console.log(user);
    //executing if block if user is already registered
    if (user) {
      //if email id is there and check for password is correct or not
      const isPasswordValid = await comparePassword(password, user.password);
      //   console.log("password valid : ", isPasswordValid);
      if (!isPasswordValid) {
        return res.status(200).send({
          success: false,
          message: "Invalid password",
        });
      }
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(200).send({
        success: true,
        message: "Login successfully",
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.roles,
        },
        token,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "User is not registered",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Login unsuccessful",
      error,
    });
  }
};

export const forgotpasswordHandler = async (req, res) => {
  try {
    const { email, answer, newpassword } = req.body;
    console.log("1");
    if (!email) {
      res.status(404).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(404).send({ message: "Security answer is required" });
    }
    if (!newpassword) {
      res.status(404).send({ message: "Password value is required" });
    }
    console.log("2");

    const user = await userModel.findOne({ email, answer });
    console.log("3");

    if (!user) {
      res.status(400).send({
        success: false,
        message: "Email or Security Answer is wrong",
      });
    }
    console.log("4");

    const hashedPassword = await hashPassword(newpassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
    res.status(200).send({
      success: true,
      message: "password reset successfully",
    });
  } catch (err) {
    console.log("5");

    res.status(500).send({
      success: false,
      message: "Something went wrong",
      err,
    });
  }
};

//test controller for usinng middleware as part to monitor
//the authorization of the user and then do execute the code user is expecting to do

export const testHandler = (req, res) => {
  res.send("User is valid and doing needful ");
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password && password < 6) {
      return res.json({ error: "Password is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while update profile",
      error,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

///order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log("req body", req.body);
    console.log("order Status/", status);
    const orders = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        OrderStatus: status,
      },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};
