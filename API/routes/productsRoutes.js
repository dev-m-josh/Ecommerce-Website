const productsRouter = require("express").Router();

const {
    getMostSellingProduct,
    getLowQuantityProducts,
    deactivateProduct,
} = require("../controllers/productsController");

productsRouter.get('/most-selling', getMostSellingProduct);
productsRouter.get('/low-quantity', getLowQuantityProducts);
productsRouter.put('/deactivate-product/:productId', deactivateProduct);

module.exports = { productsRouter };