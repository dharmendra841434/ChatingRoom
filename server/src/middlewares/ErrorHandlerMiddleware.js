import ResponseMiddleware from "./ResponseMiddleware.js";

const errorHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (ex) {
      console.log(handler);
      req.rCode = 0;
      const message = `Something went wrong -> ${ex.message}`;

      ResponseMiddleware(req, res, next, message);
    }
  };
};

export default errorHandler;
