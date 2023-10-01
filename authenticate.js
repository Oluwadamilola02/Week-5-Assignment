require("dotenv").config();

const API_KEY = process.env.api_key;

function authenticate(req, res, next) {
  const api_key = req.query.api_key;
  console.log(api_key, API_KEY);
  if (api_key == API_KEY) {
    next();
  } else {
    res.status(401).json({
      message: "you are yet to be authenticatsed",
    });
  }
}

module.exports = {
  authenticate,
};
