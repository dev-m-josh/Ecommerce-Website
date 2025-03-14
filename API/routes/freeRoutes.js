const freeRouter = require("express").Router();

const { getAllProducts } = require("../controllers/productsController");
const { addNewUser } = require("../controllers/usersController");

freeRouter.post('/users', addNewUser);
freeRouter.get('/products', getAllProducts);

module.exports = { freeRouter };