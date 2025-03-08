const usersRouter = require("express").Router();
const { getAllUsers, deleteUser } = require("../controllers/usersController");

usersRouter.get('/', getAllUsers);
usersRouter.delete('/:userId', deleteUser);

module.exports = { usersRouter };
