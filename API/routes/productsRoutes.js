const productsRouter = require("express").Router();

const {
    getMostSellingProduct,
    getLowQuantityProducts,
    deactivateProduct,
    addNewProduct,
    getAllProducts,
    deleteProduct,
    editProduct,
} = require("../controllers/productsController");

productsRouter.get('/', getAllProducts);
productsRouter.delete('/:productId', deleteProduct);
productsRouter.get('/most-selling', getMostSellingProduct);
productsRouter.get('/low-quantity', getLowQuantityProducts);
productsRouter.put('/deactivate-product/:productId', deactivateProduct);
productsRouter.post('/',addNewProduct);
productsRouter.put('/edit/:productId', editProduct);

module.exports = { productsRouter };