const salesRouter = require("express").Router();

const { totalSalesOfProduct, revenueByCategory } = require("../controllers/salesControllers");

salesRouter.get('/products', totalSalesOfProduct);
salesRouter.get('/category', revenueByCategory);

module.exports = {
    salesRouter
};