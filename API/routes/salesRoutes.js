const salesRouter = require("express").Router();

const { 
    totalSalesOfProduct,
    revenueByCategory,
    revenueCollected,
    productAndCategorySales
} = require("../controllers/salesControllers");

salesRouter.get('/products', totalSalesOfProduct);
salesRouter.get('/category', revenueByCategory);
// salesRouter.get('/revenue', revenueCollected);
salesRouter.get('/revenue', productAndCategorySales);

module.exports = {
    salesRouter
};