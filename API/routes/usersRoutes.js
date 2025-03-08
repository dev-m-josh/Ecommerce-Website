const usersRouter = require("express").Router();
const { getAllUsers, deleteUser, deactivateUser } = require("../controllers/usersController");

usersRouter.get('/', getAllUsers);
usersRouter.delete('/:userId', deleteUser);
usersRouter.put('/:userId', deactivateUser);

module.exports = { usersRouter };
