const salesRouter = require("express").Router();

const { totalSalesOfProduct } = require("../controllers/salesControllers");

salesRouter.get('/', totalSalesOfProduct);

module.exports = {
    salesRouter
};