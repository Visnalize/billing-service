import ls from "../lemon.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default function testMode(req, res, next) {
  ls.apiKey = req.query.testmode
    ? process.env.API_KEY_TEST
    : process.env.API_KEY;
  next();
}
