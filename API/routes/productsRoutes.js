const productsRouter = require("express").Router();

const { getMostSellingProduct } = require("../controllers/productsController");

productsRouter.get('/most-selling', getMostSellingProduct);

module.exports = { productsRouter };