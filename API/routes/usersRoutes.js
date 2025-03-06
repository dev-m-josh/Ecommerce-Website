const usersRouter = require("express").Router();
const { getAllUsers } = require("../controllers/usersController");

usersRouter.get('/', getAllUsers);

module.exports = { usersRouter };
