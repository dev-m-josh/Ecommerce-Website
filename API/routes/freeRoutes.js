const freeRouter = require("express").Router();

const { getAllActiveProducts } = require("../controllers/productsController");
const { addNewUser } = require("../controllers/usersController");

freeRouter.post('/users', addNewUser);
freeRouter.get('/products', getAllActiveProducts);

module.exports = { freeRouter };