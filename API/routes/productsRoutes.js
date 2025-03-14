const productsRouter = require("express").Router();

const { getMostSellingProduct, getLowQuantityProducts } = require("../controllers/productsController");

productsRouter.get('/most-selling', getMostSellingProduct);
productsRouter.get('/low-quantity', getLowQuantityProducts);

module.exports = { productsRouter };