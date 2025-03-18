const productsRouter = require("express").Router();

const {
    getMostSellingProduct,
    getLowQuantityProducts,
    deactivateProduct,
    activateProduct,
    addNewProduct,
} = require("../controllers/productsController");

productsRouter.get('/most-selling', getMostSellingProduct);
productsRouter.get('/low-quantity', getLowQuantityProducts);
productsRouter.put('/deactivate-product/:productId', deactivateProduct);
productsRouter.put('/activate-product/:productId', activateProduct);
productsRouter.post('/',addNewProduct);

module.exports = { productsRouter };