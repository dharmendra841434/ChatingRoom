import User from "../models/user.model.js";

const registerUser = async (req, res, next) => {
  const resp = await User.findOne({ username: req?.body.username });
  if (resp) {
    req.rCode = 4;
    req.msg = "user_already_found";
  } else {
    const user = new User(req.body);
    // const token = user.generateJWTToken();
    await user.save();
    // res.cookie("accessToken", token, "jywuedsjfsd");
    req.rData = { messages: " user_registered" };
  }
  next();
};

const login = async (req, res, next) => {
  const resp = await User.findOne({ username: req?.body.username });
  if (resp) {
    const isMatch = await resp.checkPassword(req?.body.password);
    if (isMatch) {
      const token = resp.generateJWTToken();
      const cookieOptions = {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
        secure: process.env.NODE_ENV === "production", // Secure only in production
        sameSite: "None",
        // sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax", // Strict in production, Lax for local testing
      };

      res.cookie("accessToken", token, cookieOptions);
      req.rData = { token };
    } else {
      req.rCode = 5;
      req.msg = "incorrect_password";
    }
  } else {
    req.rCode = 5;
    req.msg = "username_not_found";
  }
  next();
};

const checkUsername = async (req, res, next) => {
  const resp = await User.findOne({ username: req?.body.username });
  if (resp) {
    req.rData = { isAvailable: false };
  } else {
    req.rData = { isAvailable: true };
  }
  next();
};

export { registerUser, login, checkUsername };
