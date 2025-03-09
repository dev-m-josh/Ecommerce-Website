const usersRouter = require("express").Router();
const { getAllUsers, deleteUser, deactivateUser, updateUserPassword, updateUserRole } = require("../controllers/usersController");

usersRouter.get('/', getAllUsers);
usersRouter.delete('/:userId', deleteUser);
usersRouter.put('/:userId', deactivateUser);
usersRouter.put('/password/:userId', updateUserPassword);
usersRouter.put('/role/:userId', updateUserRole);

module.exports = { usersRouter };
