const salesRouter = require("express").Router();

const { 
    totalSalesOfProduct,
    revenueByCategory,
    revenueCollected
} = require("../controllers/salesControllers");

salesRouter.get('/products', totalSalesOfProduct);
salesRouter.get('/category', revenueByCategory);
salesRouter.get('/revenue', revenueCollected);

module.exports = {
    salesRouter
};