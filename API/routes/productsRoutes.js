const productsRouter = require("express").Router();

const {
    getMostSellingProduct,
    getLowQuantityProducts,
    deactivateProduct,
    activateProduct,
    addNewProduct,
    getAllProducts,
    getProductDetails
} = require("../controllers/productsController");

productsRouter.get('/inactive', getAllProducts);
productsRouter.get('/most-selling', getMostSellingProduct);
productsRouter.get('/low-quantity', getLowQuantityProducts);
productsRouter.put('/deactivate-product/:productId', deactivateProduct);
productsRouter.put('/activate-product/:productId', activateProduct);
productsRouter.post('/',addNewProduct);
productsRouter.get('/product/:productId', getProductDetails)

module.exports = { productsRouter };