const productsRouter = require("express").Router();

const {
    getMostSellingProduct,
    getLowQuantityProducts,
    deactivateProduct,
    activateProduct,
    addNewProduct,
    getAllProducts,
    deleteProduct,
    editProduct,
} = require("../controllers/productsController");

productsRouter.get('/inactive', getAllProducts);
productsRouter.delete('/:productId', deleteProduct)
productsRouter.get('/most-selling', getMostSellingProduct);
productsRouter.get('/low-quantity', getLowQuantityProducts);
productsRouter.put('/deactivate-product/:productId', deactivateProduct);
productsRouter.put('/activate-product/:productId', activateProduct);
productsRouter.post('/',addNewProduct);
productsRouter.put('/edit/:productId', editProduct);

module.exports = { productsRouter };