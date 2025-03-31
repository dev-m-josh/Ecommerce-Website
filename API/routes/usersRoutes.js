const usersRouter = require("express").Router();
const { getAllUsers, deleteUser, deactivateUser, updateUserPassword, updateUserRole, getUserProfile } = require("../controllers/usersController");

usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUserProfile)
usersRouter.delete('/:userId', deleteUser);
usersRouter.put('/deactivate/:userId', deactivateUser);
usersRouter.put('/password/:userId', updateUserPassword);
usersRouter.put('/role/:userId', updateUserRole);

module.exports = { usersRouter };
