import jwt from "jsonwebtoken";
const JWTSECRET = process.env.JWTSECRET;
import ResponseMiddleware from "./ResponseMiddleware.js";
import User from "../models/user.model.js";

const verifyUserToken = async (req, res, next) => {
  console.log("AuthMiddleware => verifyUserToken");
  let usertoken = req.headers.authorization;

  // console.log(req.headers, "usertoken");

  try {
    if (usertoken) {
      let tokens = usertoken.split(" ");
      let token = tokens[1];
      //console.log("Token", token);
      let payload = jwt.verify(token, JWTSECRET);
      //console.log(payload, "tokren pay");

      let user = await User.findById({
        _id: payload._id,
      });

      // console.log(user, "user");

      //checking user must exist in our DB else throwing error
      if (user) {
        console.log(`User with ID ${user._id} entered.`);
        req.body.userId = user._id;
        next();
      } else {
        throw new Error("invalid_token");
      }
    } else {
      throw new Error("invalid_token");
    }
  } catch (ex) {
    console.log("heres", ex);
    req.rCode = 3;
    req.msg = "invalid_token";
    if (ex.message == "ac_deactivated") req.msg = ex.message;
    ResponseMiddleware(req, res, next);
  }
};

export { verifyUserToken };
